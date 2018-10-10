import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Staff } from '@admin/models/staff.model';
import { Order } from '@shared/models/order.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { OrderService } from '@admin/services/order.service';
import { StaffService } from '@admin/services/staff.service';
import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {

  @Input() orderId;

  staff: Staff = {};

  order = {} as Order;
  orderMap = [];

  displayedColumns: string[] = ['product', 'unitPrice', 'quantity', 'total'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  subscription: Subscription;

  constructor(private orderService: OrderService, private staffService: StaffService) { }

  ngOnInit() {
    if (this.orderId) {
      this.subscription = this.orderService.getOrdersById(this.orderId).pipe(concatMap(order => {
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

        return this.staffService.getStaff(this.order.transactionDetails.person);
      })).subscribe(staff => {
        this.staff = staff;
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
