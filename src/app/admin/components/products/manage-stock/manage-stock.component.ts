
import { TimestampService } from '@shared/services/timestamp.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@shared/services/alert.service';
import { Product, ProductStock } from '@shared/models/product.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductService } from '@shared/services/product.service';
import { startWith, map, take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { MatDatepickerInputEvent, MatSnackBar } from '@angular/material';
import { NewStockService } from '@admin/services/new-stock.service';
import { SummaryNewStockService } from '@admin/services/summary-new-stock.service';

@Component({
  selector: 'app-manage-stock',
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.scss']
})
export class ManageStockComponent implements OnInit, OnDestroy {

  myControl = new FormControl();

  newStock: ProductStock = {};
  stockProducts = [];

  productId: string;
  products: Product[];
  filteredOptions: Observable<Product[]>;

  productSubscription: Subscription;
  ProductQrySubscription: Subscription;

  constructor(private productService: ProductService,
              private alertService: AlertService,
              private route: ActivatedRoute,
              private stockService: NewStockService,
              private timestampService: TimestampService,
              private snackBar: MatSnackBar,
              private stockSummaryService: SummaryNewStockService) { }

  ngOnInit() {
    this.productId = this.route.parent.snapshot.paramMap.get('id');

    this.productSubscription = this.productService.getProducts().subscribe(resp => {
      this.products = resp;

        this.filteredOptions = this.myControl.valueChanges
        .pipe(
        startWith<string | Product>(''),
        map(value => typeof value === 'string' ? value : value.pattern),
        map(name => name ? this._filter(name) : this.products.slice())
      );

      if (this.productId) {
        // set default value for person
        this.myControl.setValue(this.productId);
        this.myControl.disable();
      }

    });
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }

    if (this.ProductQrySubscription) {
      this.ProductQrySubscription.unsubscribe();
    }
  }

  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();

    return this.products.filter(option => option.pattern.toLowerCase().includes(filterValue));
  }

  displayFn(productId) {

    // I want to get the full object and display the name
    if (!productId) {
      return;
    }

    this.newStock.product = productId; // assign selected person id to model

    const index = this.products.findIndex(p => p.id === productId);
    return this.products[index].pattern;
  }

  getProductDetails(productId: string) {

    if (!productId) {
      return;
    }

    const index = this.products.findIndex(p => p.id === productId);
    return this.products[index].pattern;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  async onSubmit() {

    if (!this.newStock.supplied) {
      return this.openSnackBar('Select date for supplies before proceeding operation', 'Error');
    }

    const confirm = await this.alertService.confirmUpdate();
      if (confirm.value) {

        // for private input
        if (this.productId) {

          // double ensuring that all giving is recorded for this product
          this.newStock.product = this.productId;

          // save record
          await this.stockService.addStock(this.newStock);

          // update stock-monthly-summary quantity
          await this.stockSummaryService.addOrUpdateSummary(this.newStock.supplied, this.newStock.quantity);

          this.alertService.afterUpdateSuccess();
          this.resetInput();
          return;

        }

      // else save record
      await this.stockService.addStock(this.newStock);

      // update stock-monthly-summary quantity
      await this.stockSummaryService.addOrUpdateSummary(this.newStock.supplied, this.newStock.quantity);

      this.alertService.afterUpdateSuccess();
      this.resetInput();
    }
  }

  async deleteStockRecord(stock: ProductStock) {
    const confirm = await this.alertService.confirmDelete();
    if (confirm.value) {
      const timestampDate = this.timestampService.timestampToDate(stock.supplied);
      await this.stockSummaryService.addOrUpdateSummary(timestampDate, -stock.quantity);
      await this.stockService.deleteStock(stock.id);

      this.alertService.afterDeleteSuccess();
    }
  }

  givingDateEvent(event: MatDatepickerInputEvent<Date>) {
    // coverts selected date to timestamp for easy querying to the qryGivingDate field
    const supplyDate = this.timestampService.dateToTimestamp(event.value);

    if (this.productId) {

      this.ProductQrySubscription = this.stockService.getStockTransactionsByDateAndPattern(supplyDate, this.productId).subscribe(resp => {
        this.stockProducts =  resp;
        // this.getCategorySummary(); // get giving summary
      });

    } else {

      this.ProductQrySubscription = this.stockService.getStockTransactionsByDate(supplyDate).subscribe(resp => {
        this.stockProducts =  resp;
        // this.getCategorySummary(); // get giving summary
      });

    }

  }

  resetInput() {
   this.newStock.lastUpdate = null;
   this.newStock.product = null;
   this.newStock.quantity = null;
   this.newStock.unitCostPrice = null;
   this.newStock.unitSalePrice = null;
   this.newStock.invoice = null;
  }


}
