import { CartItem } from '@shared/models/cartItem.model';
import { Client } from '@client/models/client.model';
import { ClientShoppingCartService } from '@client/services/client-shopping-cart.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';
import { AuthGuard } from '@admin/services/auth.guard';
import { AdminAuthGuard } from '@admin/services/admin-auth.guard';

@Component({
  selector: 'app-general-layout',
  templateUrl: './general-layout.component.html',
  styleUrls: ['./general-layout.component.scss']
})
export class GeneralLayoutComponent implements OnInit, OnDestroy {

  currentUrl: string;
  clientHeight: number;

  clientCart: Observable<CartItem[]>;

  authProviderData;

  authSubscription: Subscription;

  constructor(router: Router,
              public auth: AuthService,
              private clientCartService: ClientShoppingCartService) {
    this.clientHeight = window.innerHeight;
  }

  async ngOnInit() {
    this.authSubscription = this.auth.user$.subscribe(user => {
      this.authProviderData  = {};
      console.log(this.authProviderData);

      if (!user) { return; }
      this.authProviderData = user.providerData[0];
      // console.log(this.authProviderData);
    });

    this.clientCart = (await this.clientCartService.getCart());
  }

  ngOnDestroy(): void {
   if (this.authSubscription) {
     this.authSubscription.unsubscribe();
   }
  }

  getCartItemTotal(cart) {
    return this.clientCartService.getCartTotalItemCount(cart);
  }

  async signOut() {
    await this.auth.logout();
  }

}
