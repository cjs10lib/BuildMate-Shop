import { Observable, Subscription } from 'rxjs';
import { ProjectService } from '@shared/services/project-service.service';
import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Project } from '@shared/models/project.model';
import { Upload } from '@admin/models/upload.model';
import { UploadService } from '@shared/services/upload.service';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';

@Component({
  selector: 'app-our-recent-projects',
  templateUrl: './our-recent-projects.component.html',
  styleUrls: ['./our-recent-projects.component.scss']
})
export class OurRecentProjectsComponent implements OnInit, OnDestroy {

  @Input() showBreadcrum = true;

  pageHeader = 'Our Projects';
  pageText = ``;

  // projects: Project[] = [];
  datasource: Project[] = [];
  activePageDataChunk: Project[] = [];

  gallery: Upload[] = [];

  // MatPaginator Inputs
  length = 1000;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 24, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  showSpinner = true;
  subscription: Subscription;
  projectSubscription: Subscription;

  constructor(private projectService: ProjectService,
              private uploadService: UploadService) { }

  ngOnInit() {
    this.subscription = this.uploadService.getAllGallery().subscribe(gallery => {
      this.gallery = gallery;

      this.projectSubscription = this.projectService.getProjects().subscribe(projects => {
        this.length = projects.length;

        this.datasource = projects;
        this.activePageDataChunk = this.datasource.slice(0, this.pageSize);

        this.showSpinner = false;
      });

    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  onPageChanged(e) {
    const firstCut = e.pageIndex * e.pageSize;
    const secondCut = firstCut + e.pageSize;
    this.activePageDataChunk = this.datasource.slice(firstCut, secondCut);
  }

  getAvatarDetails(avatarId: string) {
    if (!avatarId) { return; }

    const index = this.gallery.findIndex(g => g.Id === avatarId);
    return this.gallery[index].url;
  }

}
