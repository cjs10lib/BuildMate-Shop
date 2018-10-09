import { Staff } from '@admin/models/staff.model';
import { OrderService } from '@admin/services/order.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ClientAccountService } from '@client/services/client-account.service';
import { Order } from '@shared/models/order.model';
import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { combineLatest, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Client } from './../../../../client/models/client.model';
import { ClientOrderService } from './../../../services/client-order.service';
import { StaffService } from './../../../services/staff.service';

@Component({
  selector: 'app-sales-log',
  templateUrl: './sales-log.component.html',
  styleUrls: ['./sales-log.component.scss']
})
export class SalesLogComponent implements OnInit, OnDestroy {

  showFilterForm = false;

  transactionDateRange = {
    startDate: new Date().setDate(1),
    endDate: Date()
  };

  staffs: Staff[];
  clients: Client[];

  orderMap = [];

  displayedColumns: string[] = ['person', 'date', 'type', 'status', 'quantity'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  staffSubscription: Subscription;
  orderSubscription: Subscription;

  constructor(private staffService: StaffService,
              private clientAccountService: ClientAccountService,
              private clientOrderService: ClientOrderService,
              private staffOrderService: OrderService) { }

  ngOnInit() {
    this.staffSubscription = this.staffService.getStaffs().pipe(concatMap(staffs => {
      this.showSpinner = false;
      this.staffs = staffs;

      return this.clientAccountService.getClients();
    })).subscribe(clients => {
      this.clients = clients;
    });
  }

  ngOnDestroy(): void {
    if (this.staffSubscription) {
      this.staffSubscription.unsubscribe();
    }

    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  filterSalesLog() {
    this.showFilterForm = !this.showFilterForm;
  }

  filterSales() {
    this.orderSubscription = combineLatest(
      this.staffOrderService.getOrdersByRange(this.transactionDateRange),
      this.clientOrderService.getOrdersByRange(this.transactionDateRange)
    ).subscribe(([staffOrders, clientOrders]) => {

      const orders: Order[] = staffOrders.concat(clientOrders);

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

    this.filterSalesLog();
  }

  captureScreen() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(this.transactionDateRange.startDate + '-' + this.transactionDateRange.endDate + '.pdf'); // Generated PDF
    });
  }

}
