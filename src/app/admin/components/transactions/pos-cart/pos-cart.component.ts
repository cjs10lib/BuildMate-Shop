import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { Product } from '@shared/models/product.model';
import { Upload } from '@admin/models/upload.model';
import { Category } from '@shared/models/category.model';
import { AlertService } from '@shared/services/alert.service';
import { UploadService } from '@shared/services/upload.service';
import { ShoppingCartService } from '@admin/services/shopping-cart.service';

@Component({
  selector: 'app-pos-cart',
  templateUrl: './pos-cart.component.html',
  styleUrls: ['./pos-cart.component.scss']
})
export class PosCartComponent implements OnInit, OnDestroy {

  product: Product = {};
  category: Category[] = [];

  galleryFiles: Upload[] = [];

  productQty: number;

  isLoading = true;
  subscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private cartService: ShoppingCartService,
              private dialogRef: MatDialogRef<PosCartComponent>,
              private alertService: AlertService,
              private uploadService: UploadService) { }

  async ngOnInit() {

    this.subscription = this.uploadService.getAllGallery().subscribe(resp => {
      this.galleryFiles = resp;
    });

    this.category = this.data['category'];
    this.product = this.data['product'];

    // add item to cart
    this.addToCart();
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

    const index = this.galleryFiles.findIndex(g => g.Id === avatarId);
    return this.galleryFiles[index].url;
  }

  async addToCart() {
    await this.cartService.addToCart(this.product);
    return this.getCartItem(this.product.id);
  }

  async getCartItem(productId) {
    const product = await this.cartService.getCartItem(productId);
    this.productQty = product ? product.quantity : 1;

    this.isLoading = false;
  }

  async removeFromCart() {
    await this.cartService.removeFromCart(this.product);
    return this.getCartItem(this.product.id);
  }

  async deleteFromCart() {
    const confirm = await this.alertService.confirmDelete();
    if (confirm.value) {
      await this.cartService.deleteFromCart(this.product);
      this.dialogRef.close();
    }
  }

  getCategorDetails(categoryId: string) {
    if (!categoryId) {
      return;
    }

    const index = this.category.findIndex(c => c.id === categoryId);
    return this.category[index].name;
  }

}
