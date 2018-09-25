import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartItem } from '@shared/models/cartItem.model';
import { Client } from '@client/models/client.model';
import { AlertService } from '@shared/services/alert.service';
import { ClientOrderService } from '@admin/services/client-order.service';
import { ClientShoppingCartService } from '@client/services/client-shopping-cart.service';
import { TimestampService } from '@shared/services/timestamp.service';
import { AuthService } from '@shared/services/auth.service';
import { Details, Order } from '@shared/models/order.model';

@Component({
  selector: 'app-client-check-out',
  templateUrl: './client-check-out.component.html',
  styleUrls: ['./client-check-out.component.scss']
})
export class ClientCheckOutComponent implements OnInit, OnDestroy {

  client: Client = {};

  cart: CartItem[] = [];
  cartTotalQTY = 0;
  cartTotalPrice = 0;

  checkOutTransactionInfo: Details = {
    amountPaid: 0,
    transactionStatus: 'PENDING', // pending, processing or completed
    remitStatus: false
  };

  step = 0;

  clientSubscription: Subscription;
  cartSubcription: Subscription;

  constructor(private clientCartService: ClientShoppingCartService,
              private auth: AuthService,
              private timestampService: TimestampService,
              private clientOrderService: ClientOrderService,
              private snackBar: MatSnackBar,
              private router: Router,
              private alertService: AlertService) { }

  async ngOnInit() {
    this.clientSubscription = this.auth.user$.subscribe(user => {
      this.client.uid = user.uid;
      this.client = user;

      this.checkOutTransactionInfo.person =  this.client.uid;
    });

    this.cartSubcription = (await this.clientCartService.getCart()).subscribe(cart => {
      console.log(cart);
      this.cart = cart;
      this.getCartItemsTotalQTY(); // loads total QTY to check-out button
    });
  }

  ngOnDestroy(): void {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }

    if (this.cartSubcription) {
      this.cartSubcription.unsubscribe();
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  async placeOrder() {

    const date = this.timestampService.getTimestamp;
    const order: Order = {
      transactionDetails: this.checkOutTransactionInfo,
      datePlaced: date,
      items: this.cart.map(i => {
        return {
          product: {
            id: i.product.id,
            pattern: i.product.pattern,
            unitPrice: i.product.unitPrice
          },
          quantity: i.quantity,
          totalPrice: i.product.unitPrice * i.quantity,
          transactionDetails: this.checkOutTransactionInfo,
        };
      })
    };

    const confirm = await this.alertService.addToCart();
    if (confirm.value) {
      const result = await this.clientOrderService.placeOrder(order);
      this.router.navigate(['order-success', result.id]);

      this.alertService.addToCartSuccess();
    }

  }

  getCartItemsTotalQTY() {
    const totalQTY = this.clientCartService.getCartTotalItemCount(this.cart);
    return totalQTY;
  }

  getCartItemsTotalPrice() {
    return this.clientCartService.getCartTotalPrice(this.cart);
  }

  getOutStandingPayment() {
    const balance = this.getCartItemsTotalPrice() - (this.checkOutTransactionInfo.amountPaid || 0);
    this.checkOutTransactionInfo.balance = balance;

    return balance;
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
