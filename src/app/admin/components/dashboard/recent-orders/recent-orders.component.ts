import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { combineLatest, Subscription, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { Client } from '@client/models/client.model';
import { Order } from '@shared/models/order.model';
import { Staff } from '@admin/models/staff.model';
import { ClientAccountService } from '@client/services/client-account.service';
import { ClientOrderService } from '@admin/services/client-order.service';
import { OrderService } from '@admin/services/order.service';
import { StaffService } from '@admin/services/staff.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-recent-orders',
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.css']
})
export class RecentOrdersComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  orderMap = [];

  staffs: Staff[] = [];
  clients: Client[] = [];

  displayedColumns: string[] = ['date', 'person', 'transactionType', 'transactionStatus', 'paid', 'balance'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  showSpinner = true;
  subscription: Subscription[] = [];

  constructor(private breakpointObserver: BreakpointObserver,
              private staffOrderService: OrderService,
              private clientOrderService: ClientOrderService,
              private staffService: StaffService,
              private clientAccountService: ClientAccountService) { }

  ngOnInit() {

    this.subscription.push(this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        return this.displayedColumns = ['date', 'person', 'balance'];
      }

      // else
      return this.displayedColumns = ['date', 'person', 'transactionType', 'transactionStatus', 'paid', 'balance'];
    }));

    this.subscription.push(this.staffService.getStaffs().pipe(concatMap(staffs => {
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

      const orders: Order[] = staffOrders.concat(clientOrders);

      this.orderMap = orders.map(c => {
        return {
          date: c.datePlaced,
          person: c.transactionDetails.person,
          transactionType: c.transactionDetails.transactionType,
          transactionStatus: c.transactionDetails.transactionStatus,
          paid: c.transactionDetails.amountPaid,
          balance: c.transactionDetails.balance,
          remitStatus: c.transactionDetails.remitStatus
        };
      });

      this.dataSource = new MatTableDataSource(this.orderMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    }));

    // this.subscription = this.staffService.getStaffs().pipe(switchMap(staffs => {
    //   this.staffs = staffs;
    //   this.showSpinner = false;

    //   return this.orderService.getOrders();
    // })).subscribe(orders => {

    //   this.orderMap = orders.map(c => {
    //     return {
    //       date: c.datePlaced,
    //       person: c.transactionDetails.person,
    //       transactionType: c.transactionDetails.transactionType,
    //       transactionStatus: c.transactionDetails.transactionStatus,
    //       paid: c.transactionDetails.amountPaid,
    //       balance: c.transactionDetails.balance,
    //       remitStatus: c.remitStatus
    //     };
    //   });

    //   this.dataSource = new MatTableDataSource(this.orderMap);
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;

    //  });
  }

  ngOnDestroy(): void {
   if (this.subscription.length > -1) {
     this.subscription.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
     });
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
