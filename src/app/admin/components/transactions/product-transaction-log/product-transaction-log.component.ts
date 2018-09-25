import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Client } from '@client/models/client.model';
import { Order } from '@shared/models/order.model';
import { Staff } from '@admin/models/staff.model';
import { combineLatest, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { ClientAccountService } from '@client/services/client-account.service';
import { ClientOrderService } from '@admin/services/client-order.service';
import { OrderService } from '@admin/services/order.service';
import { StaffService } from '@admin/services/staff.service';

@Component({
  selector: 'app-product-transaction-log',
  templateUrl: './product-transaction-log.component.html',
  styleUrls: ['./product-transaction-log.component.scss']
})
export class ProductTransactionLogComponent implements OnInit, OnDestroy {

  staffs: Staff[] = [];
  clients: Client[] = [];

  productOrders: Order[] = [];
  orderMap = [];

  displayedColumns: string[] = ['person', 'date', 'type', 'status', 'quantity'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  orderSubcription: Subscription;
  staffSubscription: Subscription;

  constructor(private staffOrderService: OrderService,
              private clientOrderService: ClientOrderService,
              private route: ActivatedRoute,
              private staffService: StaffService,
              private clientAccountService: ClientAccountService) { }

  ngOnInit() {
    const productId = this.route.parent.snapshot.paramMap.get('id');

    this.staffSubscription = this.staffService.getStaffs().pipe(concatMap(staffs => {
      this.staffs = staffs;
      this.showSpinner = false;

      return this.clientAccountService.getClients();
    })).pipe(concatMap(clients => {
      this.clients = clients;

      // return this.staffOrderService.getOrders();
      return combineLatest(
        this.staffOrderService.getOrders(),
        this.clientOrderService.getOrders()
      );
    })).subscribe(([staffOrders, clientOrders]) => {

      const sOrders =  staffOrders.filter(o => o.items.filter(i => i.product.id === productId));
      const cOrders =  clientOrders.filter(o => o.items.filter(i => i.product.id === productId));

      const orders: Order[] = sOrders.concat(cOrders);

      this.orderMap = orders.map(c => {
        return {
          datePlaced: c.datePlaced,
          person: c.transactionDetails.person,
          transactionType: c.transactionDetails.transactionType,
          transactionStatus: c.transactionDetails.transactionStatus,
          quantity: c.items.map(i => i.quantity)
        };
      });

      this.dataSource = new MatTableDataSource(this.orderMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    });

  }

  ngOnDestroy(): void {
    if (this.orderSubcription) {
      this.orderSubcription.unsubscribe();
    }

    if (this.staffSubscription) {
      this.staffSubscription.unsubscribe();
    }
  }

  getPersonDetails(personId: string) {
    if (!personId) {
      return;
    }

    const staffIndex = this.staffs.findIndex(s => s.id === personId);
    if (staffIndex > -1) {
      return this.staffs[staffIndex].names;
    }

    const clientIndex = this.clients.findIndex(c => c.uid === personId);
    if (clientIndex > -1) {
      return this.clients[clientIndex].displayName;
    }
  }

}
