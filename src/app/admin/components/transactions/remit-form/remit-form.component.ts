
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Order, Details } from '@shared/models/order.model';
import { Product } from '@shared/models/product.model';
import { ProductService } from '@shared/services/product.service';
import { AlertService } from '@shared/services/alert.service';
import { TimestampService } from '@shared/services/timestamp.service';
import { OrderRemitService } from '@admin/services/order-remit.service';

@Component({
  selector: 'app-remit-form',
  templateUrl: './remit-form.component.html',
  styleUrls: ['./remit-form.component.css']
})
export class RemitFormComponent implements OnInit, OnDestroy {

  @Input() staffOrder: Order;
  orderItemsMap = [];

  products: Product[] = [];

  remitOrderTransactionDetails: Details = {
    remitStatus: true,
    amountPaid: 0,
    balance: 0
  };

  displayedColumns: string[] = ['product', 'quantity', 'total'];
  dataSource: MatTableDataSource<Order>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  subscription: Subscription;

  constructor(private productService: ProductService,
              private snackBar: MatSnackBar,
              private timestampService: TimestampService,
              private alertService: AlertService,
              private orderRemitService: OrderRemitService,
              private router: Router) { }

  ngOnInit() {

    this.subscription = this.productService.getProducts().subscribe(async products => {
      this.products = products;
      this.showSpinner = false;

      this.orderItemsMap = this.staffOrder.items.map(c => {
        return {
          product: c.product.pattern,
          quantity: c.quantity,
          total: c.totalPrice
        };
      });

      // initialised parameters
      this.remitOrderTransactionDetails.person = this.staffOrder.transactionDetails.person;
      this.remitOrderTransactionDetails.transactionType = 'Cash';

      this.dataSource = new MatTableDataSource(this.orderItemsMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy(): void {
   if (this.subscription) {
     this.subscription.unsubscribe();
   }
  }

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.staffOrder.items.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
  }

  getTotalItemCount() {
    return this.orderItemsMap.length;
  }

  getProductDetails(productId: string) {
    if (!productId) {
      return;
    }

    const index = this.products.findIndex(p => p.id === productId);
    return this.products[index].pattern;
  }

  // form actions
  transactionOnChange(event) {
    return this.remitOrderTransactionDetails.amountPaid = 0;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getOutStandingPayment() {
    return this.staffOrder.transactionDetails.balance - this.remitOrderTransactionDetails.amountPaid;
  }

  async remitOrder() {
    if (!this.remitOrderTransactionDetails.person) {
      return this.openSnackBar('Select collecting staff before proceeding operation!', 'Error');
    }

    if (this.remitOrderTransactionDetails.transactionType === 'Cash' &&
      (!this.remitOrderTransactionDetails.amountPaid ||
      this.remitOrderTransactionDetails.amountPaid < 1)) {
      return this.openSnackBar('Enter amount paid for cash transactions before proceeding operation!', 'Error');
    }

    // setting this.staffOrder parameters
    this.staffOrder.items.forEach(item => {
      item.transactionDetails = this.remitOrderTransactionDetails;
      this.staffOrder.transactionDetails = this.remitOrderTransactionDetails;
    });

    const date = this.timestampService.getTimestamp;
    this.staffOrder.lastUpdate = date;


    const confirm = await this.alertService.confirmUpdate();
    if (confirm.value) {
      const staffId = this.staffOrder.transactionDetails.person;

      await this.orderRemitService.remitOrder(this.staffOrder, this.staffOrder.id);

      this.remitOrderTransactionDetails = {};
      this.router.navigate(['account', 'staff', staffId, 'transaction-log']);

      this.alertService.afterUpdateSuccess();
    }

  }

}
