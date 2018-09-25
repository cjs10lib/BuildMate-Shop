import { Upload } from '@admin/models/upload.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from '@shared/models/cartItem.model';
import { Product } from '@shared/models/product.model';
import { ProductService } from '@shared/services/product.service';
import { UploadService } from '@shared/services/upload.service';
import { Subscription } from 'rxjs';

import { ClientShoppingCartService } from '@client/services/client-shopping-cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  @Input() showBreadcrum = true;

  pageHeader = 'Product';
  pageText = `Lorem ipsum dolor sit amet consectetur adipisicing elit.`;

  productId: string;
  product: Product = {};
  gallery: Upload[] = [];

  clientCart: CartItem[] = [];

  pageUrl: string;

  subsription: Subscription;
  routeSubsription: Subscription;
  productSubsription: Subscription;
  cartSubsription: Subscription;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private uploadService: UploadService,
              private router: Router,
              private clientCartService: ClientShoppingCartService) { }

  ngOnInit() {
    this.routeSubsription = this.route.paramMap.subscribe(param => {
      this.productId = param.get('id');

      this.pageUrl =  window.location.href;

      const avatars = [];
      this.subsription = this.uploadService.getAllGallery().subscribe(gallery => {
        gallery.forEach(item => {
          if (item.sourceId === this.productId) {
            avatars.push(item);
          }
        });

        this.gallery = avatars;
      });

      this.productSubsription = this.productService.getProduct(this.productId).subscribe(async product => {
        this.product = product;

        this.cartSubsription = (await this.clientCartService.getCart()).subscribe(cart => {
          this.clientCart = cart;
        });

      });
    });

  }

  ngOnDestroy(): void {
    if (this.routeSubsription) {
      this.routeSubsription.unsubscribe();
    }

    if (this.subsription) {
      this.subsription.unsubscribe();
    }

    if (this.productSubsription) {
      this.productSubsription.unsubscribe();
    }

    if (this.cartSubsription) {
      this.cartSubsription.unsubscribe();
    }
  }

  async addToCart($event) {
    $event.stopPropagation();

    // set productId
    this.product.id = this.productId;
    await this.clientCartService.addToCart(this.product);
  }

  async removeItemFromCart(event) {
    event.stopPropagation();

    // set productId
    this.product.id = this.productId;
    await this.clientCartService.removeFromCart(this.product);
  }

  getProduct() {
    if (this.clientCart.length < 1) { return 0; }

    return this.clientCart.find(c => c.id === this.productId);
  }

}
