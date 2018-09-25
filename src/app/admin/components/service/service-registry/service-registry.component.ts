import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Service } from '@shared/models/service.model';
import { Upload } from '@admin/models/upload.model';
import { ServiceCategoryService } from '@shared/services/service-category.service';
import { UploadService } from '@shared/services/upload.service';

@Component({
  selector: 'app-service-registry',
  templateUrl: './service-registry.component.html',
  styleUrls: ['./service-registry.component.scss']
})
export class ServiceRegistryComponent implements OnInit, OnDestroy {

  // search Qry
  searchQry: string;

  services: Service[] = [];
  filteredService: Service[] = [];

  galleryFiles: Upload[] = [];

  showSpinner = true;
  gallerySubscription: Subscription;
  serviceSubscription: Subscription;

  constructor(private uploadService: UploadService,
              private serviceCategoryService: ServiceCategoryService) { }

  ngOnInit() {
    this.gallerySubscription = this.uploadService.getAllGallery().subscribe(gallery => {
      this.galleryFiles = gallery;
      this.showSpinner = false;

    });
    this.serviceSubscription = this.serviceCategoryService.getServiceCategories().subscribe(services => {
      this.services = this.filteredService = services;
    });
  }

  ngOnDestroy(): void {
    if (this.gallerySubscription) {
      this.gallerySubscription.unsubscribe();
    }

    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
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

    this.filteredService = qry ?
    this.services.filter(
      s => s.category.toLowerCase().includes(qry.toLowerCase())) : this.services;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
