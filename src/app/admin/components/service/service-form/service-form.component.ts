import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceCategoryService } from '@shared/services/service-category.service';
import { AlertService } from '@shared/services/alert.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';
import { Service } from '@shared/models/service.model';
import { UploadService } from '@shared/services/upload.service';
import { ImageCompressService } from '@admin/services/image-compress.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit, OnDestroy {

  serviceId: string;
  service: Service = {};

  step = 0;

  imageUrl = '../../../../assets/avatars/avatar3.png';
  fileToUpload: File[] = [];
  uploadError;
  isHovering: boolean;

  subscription: Subscription;
  imageSubscription: Subscription;

  constructor(public sanitizer: DomSanitizer,
              private alertService: AlertService,
              private serviceCategoryService: ServiceCategoryService,
              private router: Router,
              private uploadService: UploadService,
              private route: ActivatedRoute,
              private imageCompressService: ImageCompressService) { }

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('id');

    if (this.serviceId) {
      this.subscription = this.serviceCategoryService.getServiceCategory(this.serviceId).subscribe(service => {
        this.service = service;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    const confirm = await this.alertService.confirmUpdate();
    if (confirm.value) {
      const service = await this.serviceCategoryService.addService(this.service);
      const serviceId = (await service.service).id;
      const avatar = service.avatar;

      this.uploadService.pushUpload(this.fileToUpload, serviceId, 'SERVICE', avatar);

      this.alertService.afterUpdateSuccess();
      this.router.navigate(['account', 'services']);
    }
  }

  async onDelete() {
    const confirm = await this.alertService.confirmDelete();
    if (confirm.value) {
      await this.serviceCategoryService.deleteService(this.service, this.serviceId);

      this.alertService.afterDeleteSuccess();
      this.router.navigate(['account', 'services']);
    }
  }

  toggleHover($event: boolean) {
    this.isHovering = $event;
  }

  onImageChange(event) {
    try {
      const image: File = event.target.files[0];
      this.uploadError = null;

      if (image.size > 512000) {
        this.uploadError = 'File should not exceed 500KB';
        console.log('😢 File should not exceed 500KB');
        return;
      }

      this.imageSubscription = this.imageCompressService.imageResize(image).pipe(switchMap(_resized => {
        return this.imageCompressService.imageCompress(_resized);
      })).subscribe(_resized => {
        this.fileToUpload.push(new File([_resized], _resized.name));
        this.getImagePreview(this.fileToUpload[0]);
      });

    } catch (error) {
      this.uploadError = error.reason;
      console.log('😢 Oh no!', error);
    }
  }

  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageUrl = reader.result.toString();
    };
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
