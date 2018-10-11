import { ClientOrderService } from '@admin/services/client-order.service';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Order } from '@shared/models/order.model';
import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Client } from './../../../../client/models/client.model';
import { ClientAccountService } from './../../../../client/services/client-account.service';

@Component({
  selector: 'app-client-invoice',
  templateUrl: './client-invoice.component.html',
  styleUrls: ['./client-invoice.component.scss']
})
export class ClientInvoiceComponent implements OnInit, OnDestroy {

  @Input() orderId: string;

  client: Client = {};

  order = {} as Order;
  orderMap = [];

  displayedColumns: string[] = ['product', 'unitPrice', 'quantity', 'total'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  subscription: Subscription;

  constructor(private orderService: ClientOrderService, private clientService: ClientAccountService) { }

  ngOnInit() {
    if (this.orderId) {
      this.subscription = this.orderService.getOrder(this.orderId).pipe(concatMap(order => {
        this.order = order;
        this.showSpinner = false;

        this.orderMap = order.items.map(p => {
          return {
            product: p.product.pattern,
            unitPrice: p.product.unitPrice,
            quantity: p.quantity,
            total: p.totalPrice
          };
        });

        console.log(this.order);
        console.log(this.orderMap);

        this.dataSource = new MatTableDataSource(this.orderMap);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        return this.clientService.getClient(this.order.transactionDetails.person);
      })).subscribe(client => {
        this.client = client;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.orderMap.map(t => t.total).reduce((acc, value) => acc + value, 0);
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
      pdf.save(this.orderId + '.pdf'); // Generated PDF
    });
  }

}
