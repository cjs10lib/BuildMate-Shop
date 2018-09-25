import { Product } from '@shared/models/product.model';
import { StaffService } from '@admin/services/staff.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest, Observable } from 'rxjs';

import { SummarySale } from '@admin/models/summary-sales.model';
import { SummaryNewStockService } from '@admin/services/summary-new-stock.service';
import { SummarySaleService } from '@admin/services/summary-sale.service';
import { SummaryStaffOrdersService } from '@admin/services/summary-staff-orders.service';
import { ProductService } from '@shared/services/product.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit, OnDestroy {

  products: Product[] = [];

  saleTotal: SummarySale = {};
  stockTotal = 0;
  orderTotal: SummarySale = {};

  staffTotal = 0;

  subscription: Subscription;
  ordersTotalSubscription: Subscription;

  constructor(private saleSummaryService: SummarySaleService,
              private productService: ProductService,
              private staffService: StaffService,
              private ordersSummary: SummaryStaffOrdersService) { }

  ngOnInit() {
    this.subscription = combineLatest(
      this.saleSummaryService.getSaleSummaryCurrentMonth(),
      this.productService.getProducts(),
      this.ordersSummary.getOrderSummaryCurrentMonth(),
      this.staffService.getStaffs()
    ).subscribe(([sale, products, order, staff]) => {
      this.saleTotal = sale;
      this.orderTotal = order;

      this.staffTotal = staff.length;

      // get product stock QTY
      let count = 0;
      products.forEach(item => {
        count += item.availableQTY;
      });

      this.stockTotal = count;

    }, error =>  {
      console.log(error);
    });


    // this.subscription =  this.stockSummary.getStockSummaryCurrentMonth().subscribe(resp => console.log(resp));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
