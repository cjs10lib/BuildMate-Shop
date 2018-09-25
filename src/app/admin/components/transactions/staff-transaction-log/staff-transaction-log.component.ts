import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { OrderService } from '@admin/services/order.service';

@Component({
  selector: 'app-staff-transaction-log',
  templateUrl: './staff-transaction-log.component.html',
  styleUrls: ['./staff-transaction-log.component.scss']
})
export class StaffTransactionLogComponent implements OnInit, OnDestroy {

  orderMap = [];

  displayedColumns: string[] = ['date', 'transactionType', 'paid', 'balance', 'remitStatus'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  showSpinner = true;
  subcription: Subscription[] = [];

  constructor(private orderService: OrderService,
              private route: ActivatedRoute,
              private breakpointObserver: BreakpointObserver) { }

  async ngOnInit() {
    const staffId = this.route.parent.snapshot.paramMap.get('id');

    this.subcription.push(this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        return this.displayedColumns = ['date', 'transactionType', 'remitStatus'];
      }

      // else
      return this.displayedColumns = ['date', 'transactionType', 'paid', 'balance', 'remitStatus'];
    }));

    this.subcription.push(this.orderService.getOrders().subscribe(orders => {
      this.showSpinner = false;

      const staffOrders = orders.filter(o => o.transactionDetails.person === staffId);

      this.orderMap = staffOrders.map(c => {
        return {
          date: c.datePlaced,
          transactionType: c.transactionDetails.transactionType,
          remitStatus: c.transactionDetails.remitStatus,
          paid: c.transactionDetails.amountPaid,
          balance: c.transactionDetails.balance,
        };
      });

      this.dataSource = new MatTableDataSource(this.orderMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    }));
  }

  ngOnDestroy(): void {
    if (this.subcription.length > -1) {
      this.subcription.forEach(sub => {
        if (sub) {
          sub.unsubscribe();
        }
      });
    }
  }

  /** Gets the total cost of all transactions. */
  getPaidTotalCost() {
    return this.orderMap.map(t => t.paid).reduce((acc, value) => acc + value, 0);
  }

  /** Gets the total cost of all transactions. */
  getBalanceTotalCost() {
    return this.orderMap.map(t => t.balance).reduce((acc, value) => acc + value, 0);
  }

}
