import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CartItem } from '@shared/models/cartItem.model';
import { Product } from '@shared/models/product.model';
import { Service } from '@shared/models/service.model';
import { Upload } from '@admin/models/upload.model';
import { ProductService } from '@shared/services/product.service';
import { ServiceCategoryService } from '@shared/services/service-category.service';
import { UploadService } from '@shared/services/upload.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ShoppingCartService } from '@admin/services/shopping-cart.service';
import { PosCartComponent } from './../pos-cart/pos-cart.component';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit, OnDestroy {

  // search Qry
  searchQry: string;

  cart: CartItem[] = [];
  cartTotalQTY = 0;

  product: Product[] = [];
  filteredProduct: Product[] = [];

  galleryFiles: Upload[] = [];

  category: Service[] = [];

  showSpinner = true;

  subscription: Subscription;
  cartSubscription: Subscription;

  constructor(private productService: ProductService,
              private serviceCategoryService: ServiceCategoryService,
              private dialog: MatDialog,
              private cartService: ShoppingCartService,
              private uploadService: UploadService) { }

  async ngOnInit() {

    this.cartSubscription = (await this.cartService.getCart()).pipe(switchMap(cart => {
      this.cart = cart;
      this.showSpinner = false;
      this.getCartItemsTotalQTY(); // loads total QTY to check-out button

      return this.uploadService.getAllGallery();
    }), switchMap(gallery => {
      this.galleryFiles = gallery;

      return this.serviceCategoryService.getServiceCategories();
    }), switchMap(categories => {
      this.category = categories;

      return this.productService.getProducts();
    })).subscribe(products => {
      this.product = this.filteredProduct = products;
    });
  }

  ngOnDestroy(): void {
   if (this.subscription) {
     this.subscription.unsubscribe();
    }

   if (this.cartSubscription) {
     this.cartSubscription.unsubscribe();
    }
  }

  getAvatarDetails(avatarId: string) {
    if (!avatarId) {
      return;
    }

    const index = this.galleryFiles.findIndex(g => g.Id === avatarId);
    return this.galleryFiles[index].url;
  }

  addToCart(product: Product) {

    this.dialog.open(PosCartComponent, {
      data: {
        product: product,
        category: this.category,
      }
    });
  }

  getCartItemDetails(productId: string) {
    if (!productId) {
      return;
    }

    if (this.cart.length < 1) { return 0; }

    const cartId = localStorage.getItem('cartId');
    if (!cartId) { return; }

    const index = this.cart.findIndex(p => p.product.id === productId);
    return index > -1 ? this.cart[index].quantity : 0;
  }

  getCartItemsTotalQTY() {
    const total = this.cartService.getCartTotalItemCount(this.cart);
    this.cartTotalQTY = total;
  }

  getServiceCategorDetails(categoryId: string) {
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
