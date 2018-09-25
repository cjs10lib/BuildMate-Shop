import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Product } from '@shared/models/product.model';
import { Service } from '@shared/models/service.model';
import { Upload } from '@admin/models/upload.model';
import { ServiceCategoryService } from '@shared/services/service-category.service';
import { ProductService } from '@shared/services/product.service';
import { UploadService } from '@shared/services/upload.service';

@Component({
  selector: 'app-product-registry',
  templateUrl: './product-registry.component.html',
  styleUrls: ['./product-registry.component.css']
})
export class ProductRegistryComponent implements OnInit, OnDestroy {

  // search Qry
  searchQry: string;

  product: Product[] = [];
  filteredProduct: Product[] = [];

  galleryFiles: Upload[] = [];

  category: Service[] = [];

  showSpinner = true;
  subscription: Subscription;

  constructor(private productService: ProductService,
              private serviceCategoryService: ServiceCategoryService,
              private uploadService: UploadService) { }

  ngOnInit() {

    this.subscription = this.uploadService.getAllGallery().pipe(switchMap(gallery => {
      this.galleryFiles = gallery;
      this.showSpinner = false;

      return this.serviceCategoryService.getServiceCategories();
    })).pipe(switchMap(categories => {
      this.category = categories;

      return this.productService.getProducts();
    })).subscribe(products => {
      this.product = this.filteredProduct = products;
    });

    // this.subscription = this.categoryService.getCategories().pipe(switchMap(resp => {
    //   this.category = resp;
    //   this.showSpinner = false;
    //   return this.productService.getProducts();
    // })).subscribe(result => {
    //   this.product = this.filteredProduct = result;
    // });
  }

  ngOnDestroy(): void {
   if (this.subscription) {
     this.subscription.unsubscribe();
    }
  }

  getAvatarDetails(avatarId: string) {
    if (!avatarId) {
      return;
    }

    const index = this.galleryFiles.findIndex(g => g.Id === avatarId);
    return this.galleryFiles[index].url;
  }

  getServiceCategoryDetails(categoryId: string) {
    if (!categoryId) {
      return;
    }

    const index = this.category.findIndex(c => c.id === categoryId);
    return this.category[index].category;
  }

  search(qry: string) {

    this.filteredProduct = qry ?
    this.product.filter(
      p => p.pattern.toLowerCase().includes(qry.toLowerCase())) : this.product;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
