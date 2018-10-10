import { NewStockService } from '@admin/services/new-stock.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Product } from './../../../../shared/models/product.model';
import { ProductService } from './../../../../shared/services/product.service';

@Component({
  selector: 'app-purchase-log',
  templateUrl: './purchase-log.component.html',
  styleUrls: ['./purchase-log.component.scss']
})
export class PurchaseLogComponent implements OnInit, OnDestroy {

  showFilterForm = false;

  transactionDateRange = {
    startDate: new Date().setDate(1),
    endDate: Date()
  };

  product: Product[] = [];

  stockMap = [];

  displayedColumns: string[] = ['created', 'supplied', 'product', 'quantity'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  productSubscription: Subscription;
  stockSubscription: Subscription;

  constructor(private productService: ProductService, private productStockService: NewStockService) { }

  ngOnInit() {
    this.productSubscription = this.productService.getProducts().subscribe(products => {
      this.product = products;
      this.showSpinner = false;
    });

    this.filterStocks();
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }

    if (this.stockSubscription) {
      this.stockSubscription.unsubscribe();
    }
  }

  filterStockLog() {
    this.showFilterForm = !this.showFilterForm;
  }

  filterStocks() {
    this.stockSubscription = this.productStockService.getStockTransactionByDateQuery(this.transactionDateRange).subscribe(stocks => {
      
      this.stockMap = stocks.map(s => {
        return {
          created: s.created,
          supplied: s.supplied,
          product: s.product,
          quantity: s.quantity
        };
      });

      this.dataSource = new MatTableDataSource(this.stockMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.filterStockLog();
  }

  getProductDetails(productId: string) {
    if (!productId) { return; }

    const index = this.product.findIndex(p => p.id === productId);
    return this.product[index].pattern;
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
