import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Service } from '@shared/models/service.model';
import { Upload } from '@admin/models/upload.model';
import { UploadService } from '@shared/services/upload.service';
import { Product } from '@shared/models/product.model';
import { AlertService } from '@shared/services/alert.service';
import { ProductService } from '@shared/services/product.service';
import { ServiceCategoryService } from '@shared/services/service-category.service';

@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.component.html',
  styleUrls: ['./product-profile.component.scss']
})
export class ProductProfileComponent implements OnInit, OnDestroy {

  productId: string;

  product: Product = {};
  categories: Service[] = [];

  gallery: Upload[] = [];

  routeToDisplay = 'overview';

  navLinks = [
    { path: 'transaction-log', label: 'Transaction Log', icon: 'assessment' },
    { path: 'edit-product', label: 'Edit', icon: 'border_color' },
    { path: 'manage-stock', label: 'Manage Stock', icon: 'updates' }
  ];

  selectedTab: string;
  parentUrl = `account/product/${this.productId}`;

  subscription: Subscription;

  constructor(private productService: ProductService,
              private serviceCategoryService: ServiceCategoryService,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private router: Router,
              private uploadService: UploadService) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');

    this.parentUrl = `account/product/${this.productId}`;

    this.subscription = this.uploadService.getAllGallery().pipe(switchMap(gallery => {
      this.gallery = gallery;

      // return this.serviceCategoryService.getServiceCategories();
    // }), switchMap(categories => {
    //   this.categories = categories;

      return this.productService.getProduct(this.productId);
    })).subscribe(product => {
      this.product = product;
    });

    // get the selected tab index
    return this.tabIndex;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAvatarDetails() {
    const avatarId = this.product.avatar;
    if (!avatarId) {
      return;
    }

    const index = this.gallery.findIndex(g => g.Id === avatarId);
    return this.gallery[index].url;
  }

  editProduct() {
    const url = `account/product/${this.productId}/edit-product`;
    this.router.navigate([url]);
  }

  async deleteProduct() {
    const confirm = await this.alertService.confirmDelete();
    if (confirm.value) {
      await this.productService.deleteProduct(this.productId);

      this.alertService.afterDeleteSuccess();
      this.router.navigate(['account', 'products']);
    }
  }

  // getServiceCategoryDetails(categoryId: string) {
  //   if (!categoryId) {
  //     return;
  //   }

  //   const index = this.categories.findIndex(c => c.id === categoryId);
  //   return this.categories[index].category;
  // }

  onLinkClick(event: MatTabChangeEvent) {
    const tabTitle = event.tab.textLabel;
    const routerLink = this.navLinks.find(n => n.label === tabTitle ).path;

    this.router.navigate([this.parentUrl, routerLink]);
  }

  get tabIndex() {
    const url = this.router.url;

    if (url.includes('transaction-log')) {
      return this.selectedTab = '0';
    }

    if (url.includes('edit-product')) {
      return this.selectedTab = '1';
    }
    if (url.includes('manage-stock')) {
      return this.selectedTab = '2';
    }
  }

  get tabIndexFromStorage() {
    return localStorage.getItem(this.tabIndex);
  }

  navigate(routeToDisplay: string) {
    this.routeToDisplay = routeToDisplay;
  }

}
