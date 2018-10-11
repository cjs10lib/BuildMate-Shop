import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Client } from '@client/models/client.model';
import { Order } from '@shared/models/order.model';
import { Service } from '@shared/models/service.model';
import { Upload } from '@admin/models/upload.model';
import { AlertService } from '@shared/services/alert.service';
import { ClientAccountService } from '@client/services/client-account.service';
import { ClientOrderRemitService } from '@admin/services/client-order-remit.service';
import { ClientOrderService } from '@admin/services/client-order.service';
import { ClientOrderDetailsComponent } from './../client-order-details/client-order-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-orders',
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.scss']
})
export class ClientOrdersComponent implements OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  // search Qry
  searchQry: string;

  clients: Client[] = [];
  clientOrders: Order[] = [];
  orderMap = [];

  galleryFiles: Upload[] = [];

  category: Service[] = [];

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  clientSubscription: Subscription;
  combinedSubscription: Subscription;
  orderSubscription: Subscription;
  isHandsetSubscription: Subscription;

  constructor(private clientOrderService: ClientOrderService,
              private clientAccountService: ClientAccountService,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private clientOrderRemitService: ClientOrderRemitService,
              private alertService: AlertService,
              private router: Router) {
                this.clientSubscription = this.clientAccountService.getClients().subscribe(clients => {
                  this.clients = clients;
                });
              }

  ngOnInit() {

    this.orderSubscription = this.clientOrderService.getOrders().subscribe(orders => {
      this.showSpinner = false;
      this.clientOrders = orders;

      this.orderMap = orders.map(o => {
        return {
          client: o.transactionDetails.person,
          date: o.datePlaced,
          status: o.transactionDetails.transactionStatus,
          phone: o.transactionDetails.phoneNumber,
          paid: o.transactionDetails.amountPaid,
          balance: o.transactionDetails.balance,
          id: o.id
        };
      });

      this.dataSource = new MatTableDataSource(this.orderMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.isHandsetSubscription = this.isHandset$.subscribe(isHandset => {
      console.log(isHandset);
      if (isHandset) {
        return this.displayedColumns = ['client', 'date', 'status'];
      }

      // else
      return this.displayedColumns = ['client', 'date', 'status', 'phone', 'paid', 'balance', 'action'];
    });

  }

  ngOnDestroy(): void {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }

    if (this.combinedSubscription) {
      this.combinedSubscription.unsubscribe();
    }

    if (this.isHandsetSubscription) {
      this.isHandsetSubscription.unsubscribe();
    }

    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  processTransaction(orderId: string) {
    this.dialog.open(ClientOrderDetailsComponent, {
      width: '500px',
      data: {
        order: orderId,
        client: this.clients
      }
    }).afterClosed().pipe(take(1)).subscribe(async orders => {
      if (orders) {
        const confirm = await this.alertService.confirmUpdate();
        if (confirm.value) {
          await this.clientOrderRemitService.remitOrder(orders, orderId);

          this.alertService.afterUpdateSuccess();
          this.router.navigate(['account', 'client-order-success', orderId]);
        }

      }
    });
  }

  getClientDetails(clientId: string) {
    if (!clientId) { return; }

    const index = this.clients.findIndex(c => c.uid === clientId);
    return this.clients[index].displayName;
  }

  getTotalPaid() {
    return this.orderMap.map(t => t.paid).reduce((acc, value) => acc + value, 0);
  }

  getTotalBalance() {
    return this.orderMap.map(t => t.balance).reduce((acc, value) => acc + value, 0);
  }

}
