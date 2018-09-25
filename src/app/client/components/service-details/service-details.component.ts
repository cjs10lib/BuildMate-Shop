import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Service } from '@shared/models/service.model';
import { Upload } from '@admin/models/upload.model';
import { ServiceCategoryService } from '@shared/services/service-category.service';
import { UploadService } from '@shared/services/upload.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {

  @Input() showBreadcrum = true;

  pageHeader = 'Our Service';
  pageText = ``;

  service$: Observable<Service>;
  services$: Observable<Service[]>;
  gallery: Upload[] = [];

  subscription: Subscription;
  uploadSubscription: Subscription;

  constructor(private serviceCategoryService: ServiceCategoryService,
              private route: ActivatedRoute,
              private uploadService: UploadService) { }

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(params => {
      this.service$ = this.serviceCategoryService.getServiceCategory(params.get('id'));
      this.services$ = this.serviceCategoryService.getServiceCategories();

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
