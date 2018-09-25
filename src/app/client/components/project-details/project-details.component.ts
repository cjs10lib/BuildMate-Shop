import { ProjectService } from '@shared/services/project-service.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Project } from '@shared/models/project.model';
import { Observable, Subscription } from 'rxjs';
import { Upload } from '@admin/models/upload.model';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from '@shared/services/upload.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

  @Input() showBreadcrum = true;

  pageHeader = 'Our Project';
  pageText = ``;

  project$: Observable<Project>;
  projects$: Observable<Project[]>;
  gallery: Upload[] = [];

  subscription: Subscription;
  uploadSubscription: Subscription;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private uploadService: UploadService) { }

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(params => {
      this.project$ = this.projectService.getProject(params.get('id'));
      this.projects$ = this.projectService.getProjects();

      this.uploadSubscription = this.uploadService.getAllGallery().subscribe(gallery => {
        this.gallery = gallery;
      });
    });
  }

  ngOnDestroy(): void {
   if (this.subscription) {
     this.subscription.unsubscribe();
   }

   if (this.uploadSubscription) {
     this.uploadSubscription.unsubscribe();
   }
  }

  getAvatarDetails(avatarId: string) {
    if (!avatarId) { return; }

    const index = this.gallery.findIndex(g => g.Id === avatarId);
    return this.gallery[index].url;
  }

}
