import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { ClientOrderService } from '@admin/services/client-order.service';
import { ClientOrderAddQtyComponent } from '../client-order-add-qty/client-order-add-qty.component';
import { Details, Order } from '@shared/models/order.model';

@Component({
  selector: 'app-client-order-details',
  templateUrl: './client-order-details.component.html',
  styleUrls: ['./client-order-details.component.scss']
})
export class ClientOrderDetailsComponent implements OnInit, OnDestroy {

  cartMap = [];

  processOrder: Details = {};
  clientOrder: Order = {};

  displayedColumns: string[] = ['product', 'quantity', 'unitPrice', 'total', 'id'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  subscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<ClientOrderDetailsComponent>,
              private clientOrderService: ClientOrderService) { }

  ngOnInit() {

    this.subscription = this.clientOrderService.getOrder(this.orderId).subscribe(orders => {
      this.clientOrder = orders;

      this.cartMap = orders.items.map(c => {
        return {
          id: c.product.id,
          client: c.transactionDetails.person,
          product: c.product.pattern,
          quantity: c.quantity,
          unitPrice: c.product.unitPrice,
          total: c.product.unitPrice * c.quantity
        };
      });

      this.showSpinner = false;

      // initialised parameters
      if (this.clientOrder.transactionDetails.transactionStatus !== 'COMPLETED') {
        this.processOrder.transactionStatus = 'PROCESSING';
      } else {
        this.processOrder.transactionStatus = this.clientOrder.transactionDetails.transactionStatus;
      }
      this.processOrder.person = this.clientOrder.transactionDetails.person;

      this.dataSource = new MatTableDataSource(this.cartMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      console.log(this.cartMap);

    });

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get client() {
    return this.data['client'];
  }

  get orderId() {
    return this.data['order'];
  }

  addQuantity(event, productId: string) {
    this.dialog.open(ClientOrderAddQtyComponent).afterClosed().pipe(take(1)).subscribe(async (quantity: number) => {
      if (quantity) {
        const item = this.clientOrder.items.find(i => i.product.id === productId);
        const total = item.product.unitPrice * quantity;

        // setting parameters
        item.quantity = quantity;
        item.totalPrice = total;

        // calculating balance
        let balance = 0;
        this.clientOrder.items.forEach(items => {
          balance += items.totalPrice;
        });

        item.transactionDetails.balance = balance;
        this.clientOrder.transactionDetails.balance = balance;

        // updating QTY
        await this.clientOrderService.updateOrderProductQty(this.clientOrder, this.orderId);
      }
    });
  }

  transactionOnChange(event) {
    return this.processOrder.amountPaid = 0;
  }

  getClientDetails(clientId: string) {
    if (!clientId) { return; }

    const index = this.client.findIndex(c => c.uid === clientId);
    return this.client[index].displayName;
  }

  getOutStandingPayment() {
    return (this.clientOrder.transactionDetails.balance || 0) - (this.processOrder.amountPaid || 0);
  }

 /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.cartMap.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }

  check(event: KeyboardEvent, input: number) {
    if (event.keyCode > 31 && input.toString().length === 10) {
      event.preventDefault();
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  async completeOrder() {
    if (!this.processOrder.person) {
      return this.openSnackBar('Select collecting staff before proceeding operation!', 'Error');
    }

    if (!this.processOrder.amountPaid ||
      this.processOrder.balance > 0) {
      return this.openSnackBar('Enter amount paid for cash transactions before proceeding operation!', 'Error');
    }

    this.clientOrder.transactionDetails.amountPaid = this.processOrder.amountPaid;
    this.clientOrder.transactionDetails.transactionStatus = 'COMPLETED';
    this.clientOrder.transactionDetails.balance = 0;

    // update order items
    this.clientOrder.items.forEach(item => {
      item.transactionDetails = this.clientOrder.transactionDetails;
    });

    this.dialogRef.close(this.clientOrder);
  }
}
