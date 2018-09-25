import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartItem } from '@shared/models/cartItem.model';
import { AuthService } from '@shared/services/auth.service';
import { Product } from '@shared/models/product.model';
import { ClientShoppingCartService } from '@client/services/client-shopping-cart.service';
import { ClientAccountService } from '@client/services/client-account.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit, OnDestroy {

  @Input() avatar;
  @Input() product: Product;
  @Input() clientCart: CartItem[] = [];

  user: firebase.User;

  pageUrl: string;

  subscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private clientCartService: ClientShoppingCartService,
              private clientAccountService: ClientAccountService) { }

  ngOnInit() {
    this.pageUrl = window.location.href;

    this.subscription = this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async addToCart($event) {
    $event.stopPropagation();

    try {
      if (this.user && this.user.providerData[0].providerId === 'facebook.com') {
        return await this.clientCartService.addToCart(this.product);
      }

      // else
      this.authClient();
      return await this.clientCartService.addToCart(this.product);

    } catch (error) {
      console.log(error);
    }
  }

  async removeItemFromCart(event) {
    event.stopPropagation();
    await this.clientCartService.removeFromCart(this.product);
  }

  getProduct() {
    if (this.clientCart.length < 1) { return 0; }

    return this.clientCart.find(c => c.id === this.product.id);
  }

  async productDetails() {
    try {
      if (this.user && this.user.providerData[0].providerId === 'facebook.com') {
        return this.router.navigate(['product', this.product.id]);
      }

      // else
      this.authClient();

      return this.router.navigate(['product', this.product.id]);
    } catch (error) {
      console.log(error);
    }
  }

  async authClient() {
    const client = await this.authService.loginFacebook();
    this.addClient(client);
  }

  async addClient(client) {
    const clientData = client.user.providerData.map(c => {
      return {
        uid: client.user.uid,
        displayName: c.displayName,
        email: c.email,
        phoneNumber: c.phoneNumber,
        avatar: c.photoURL,
        providerId: c.providerId
      };
    });

    await this.clientAccountService.addClient(clientData);
  }

}
