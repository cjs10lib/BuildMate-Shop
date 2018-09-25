import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Category } from '@shared/models/category.model';
import { Product } from '@shared/models/product.model';
import { ProductCategoryComponent } from '../product-category/product-category.component';
import { AlertService } from '@shared/services/alert.service';
import { ProductService } from '@shared/services/product.service';
import { ServiceCategoryService } from '@shared/services/service-category.service';
import { UploadService } from '@shared/services/upload.service';
import { ImageCompressService } from '@admin/services/image-compress.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  productId: string;

  product: Product = {};
  categories$: Observable<Category[]>;

  step = 0;

  imageUrl = '../../../../assets/avatars/avatar3.png';
  fileToUpload: File[] = [];
  imagePreview: any;
  uploadError;
  isHovering: boolean;

  subscription: Subscription;
  imageSubscription: Subscription;

  constructor(private dialog: MatDialog,
              private serviceCategoryService: ServiceCategoryService,
              private productService: ProductService,
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute,
              private uploadService: UploadService,
              private imageCompressService: ImageCompressService,
              public sanitizer: DomSanitizer) {
                this.categories$ = this.serviceCategoryService.getServiceCategories();
              }

  ngOnInit() {
    this.productId = this.route.parent.snapshot.paramMap.get('id');

    if (this.productId) {
      this.subscription = this.productService.getProduct(this.productId).subscribe(product => {
        this.product = product;
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

      if (this.productId) {
        await this.productService.updateProduct(this.productId, this.product);

        this.alertService.afterUpdateSuccess();
        this.router.navigate(['account', 'products']);
        return;
      }

      // else
      const productData = await this.productService.addProduct(this.product);
      const productId = (await productData.product).id;
      const avatar = productData.avatar;

      this.uploadService.pushUpload(this.fileToUpload, productId, 'PRODUCT', avatar);

      this.alertService.afterUpdateSuccess();
      this.router.navigate(['account', 'products']);
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

  addCategory() {
    this.dialog.open(ProductCategoryComponent, {
      height: '500px',
      width: '500px'
    });
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
