import { UploadService } from '@shared/services/upload.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Service } from '@shared/models/service.model';
import { Upload } from '@admin/models/upload.model';
import { Subscription } from 'rxjs';
import { Project } from '@shared/models/project.model';
import { ProjectService } from '@shared/services/project-service.service';

@Component({
  selector: 'app-project-registry',
  templateUrl: './project-registry.component.html',
  styleUrls: ['./project-registry.component.scss']
})
export class ProjectRegistryComponent implements OnInit, OnDestroy {

  // search Qry
  searchQry: string;

  projects: Project[] = [];
  filteredProjects: Project[] = [];

  galleryFiles: Upload[] = [];

  showSpinner = true;
  gallerySubscription: Subscription;
  projectSubscription: Subscription;

  constructor(private uploadService: UploadService,
              private projectService: ProjectService) { }

  ngOnInit() {
    this.gallerySubscription = this.uploadService.getAllGallery().subscribe(gallery => {
      this.galleryFiles = gallery;
      this.showSpinner = false;

    });
    this.projectSubscription = this.projectService.getProjects().subscribe(projects => {
      this.projects = this.filteredProjects = projects;
    });
  }

  ngOnDestroy(): void {
    if (this.gallerySubscription) {
      this.gallerySubscription.unsubscribe();
    }

    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
  }

  getAvatarDetails(avatarId: string) {
    if (!avatarId) {
      return;
    }

    const index = this.galleryFiles.findIndex(g => g.Id === avatarId);
    return this.galleryFiles[index].url;
  }

  search(qry: string) {

    this.filteredProjects = qry ?
    this.projects.filter(
      p => p.name.toLowerCase().includes(qry.toLowerCase())) : this.projects;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
