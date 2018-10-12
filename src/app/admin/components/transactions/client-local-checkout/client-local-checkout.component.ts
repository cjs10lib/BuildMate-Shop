import { ClientAccountService } from '@client/services/client-account.service';
import { Client } from './../../../../client/models/client.model';
import { Component, OnInit } from '@angular/core';
import { Details, Order } from '@shared/models/order.model';
import { Subscription } from 'rxjs';
import { StaffService } from '@admin/services/staff.service';
import { ShoppingCartService } from '@admin/services/shopping-cart.service';
import { TimestampService } from '@shared/services/timestamp.service';
import { OrderService } from '@admin/services/order.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';
import { CartItem } from '@shared/models/cartItem.model';
import { ClientOrderService } from '@admin/services/client-order.service';

@Component({
  selector: 'app-client-local-checkout',
  templateUrl: './client-local-checkout.component.html',
  styleUrls: ['./client-local-checkout.component.scss']
})
export class ClientLocalCheckoutComponent implements OnInit {

  client: Client = {};

  checkOutTransactionInfo: Details = {
    transactionType: 'Cash',
    transactionStatus: 'COMPLETED',
    remitStatus: false,
    amountPaid: 0,
    balance: 0
  };

  cart: CartItem[] = [];
  cartTotalQTY = 0;
  cartTotalPrice = 0;

  step = 0;

  staffSubscription: Subscription;
  cartSubcription: Subscription;

  constructor(private clientService: ClientAccountService,
              private clientOrderService: ClientOrderService,
              private cartService: ShoppingCartService,
              private timestampService: TimestampService,
              private orderService: OrderService,
              private snackBar: MatSnackBar,
              private router: Router,
              private alertService: AlertService) { }

  async ngOnInit() {
    const cart$ = await this.cartService.getCart();
    cart$.subscribe(result => {
      this.getCartItemsTotalQTY(); // loads total QTY to check-out button
      this.cart = result;
    });
  }

  async addClient(): Promise<firebase.firestore.DocumentReference> {
    return await this.clientService.addClientLocally(this.client);
  }

  async placeOrder() {
    const clientId = (await this.addClient()).id;

    this.checkOutTransactionInfo.person = clientId;

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
      this.router.navigate(['account', 'client-order-success', result.id]);

      this.alertService.addToCartSuccess();
    }
  }

  getCartItemsTotalQTY() {
    const totalQTY = this.cartService.getCartTotalItemCount(this.cart);
    return totalQTY;
  }

  getCartItemsTotalPrice() {
    const totalPrice = this.cartService.getCartTotalPrice(this.cart);
    return totalPrice;
  }

  getOutStandingPayment() {
    const balance = this.getCartItemsTotalPrice() - this.checkOutTransactionInfo.amountPaid;
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
