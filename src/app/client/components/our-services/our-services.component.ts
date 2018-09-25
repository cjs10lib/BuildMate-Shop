import { UploadService } from '@shared/services/upload.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ServiceCategoryService } from '@shared/services/service-category.service';
import { Observable, Subscription } from 'rxjs';
import { Service } from '@shared/models/service.model';
import { Upload } from '@admin/models/upload.model';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss']
})
export class OurServicesComponent implements OnInit, OnDestroy {

  @Input() showBreadcrum = true;

  pageHeader = 'Our Services';
  pageText = ``;

  services$: Observable<Service[]>;
  gallery: Upload[] = [];

  subscription: Subscription;

  constructor(private serviceCategoryService: ServiceCategoryService,
              private uploadService: UploadService) { }

  ngOnInit() {
    this.services$ = this.serviceCategoryService.getServiceCategories();

    this.subscription = this.uploadService.getAllGallery().subscribe(gallery => {
      this.gallery = gallery;
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAvatarDetails(avatarId: string) {
    if (!avatarId) { return; }

    const index = this.gallery.findIndex(g => g.Id === avatarId);
    return this.gallery[index].url;
  }

}
