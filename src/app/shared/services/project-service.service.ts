import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { TimestampService } from '@shared/services/timestamp.service';
import { UploadService } from '@shared/services/upload.service';
import { map } from 'rxjs/operators';
import { Service } from '@shared/models/service.model';
import { Observable } from 'rxjs';
import { Project } from '@shared/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectCol: AngularFirestoreCollection<Service>;
  private projects: Observable<Project[]>;

  constructor(private db: AngularFirestore,
              private timestampService: TimestampService,
              private uploadService: UploadService) {
    this.projectCol = db.collection('projects');

    this.projects = this.projectCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Project;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getProjects() {
    return this.projects;
  }

  getProject(projectId: string) {
    return this.db.doc(`projects/${projectId}`).valueChanges();
  }

  addProject(project: Project) {
    const timestamp = this.timestampService.getTimestamp;

    const avatarId = this.db.createId();

    project.avatar = avatarId;
    project.created = project.lastUpdate = timestamp;
    const projectData = this.projectCol.add(project);

    return { project: projectData, avatar: avatarId };
  }

  async deleteProject(project: Project, projectId: string) {
    this.uploadService.deleteFileData(project.avatar);
    return await this.db.doc(`projects/${projectId}`).delete();
  }
}
