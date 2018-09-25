import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductStock } from '@shared/models/product.model';
import { ProductService } from '@shared/services/product.service';
import { TimestampService } from '@shared/services/timestamp.service';

@Injectable({
  providedIn: 'root'
})
export class NewStockService {

  private stockCol: AngularFirestoreCollection<ProductStock>;
  private stocks: Observable<ProductStock[]>;

  constructor(private db: AngularFirestore,
              private timestampService: TimestampService,
              private productService: ProductService) {
    this.stockCol = db.collection('new-stocks');

    this.stocks = this.stockCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as ProductStock;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getStockTransactionsByDateAndPattern(supplyDate, productId: string) {
    return this.db.collection('new-stocks', ref => ref
      .where('qrySupplied', '==', supplyDate)
      .where('product', '==', productId)
      .orderBy('supplied', 'asc'))
      .snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as ProductStock;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getStockTransactionsByDate(supplyDate) {
    return this.db.collection('new-stocks', ref => ref
      .where('qrySupplied', '==', supplyDate)
      .orderBy('supplied', 'asc'))
      .snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as ProductStock;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getStocksById(stockId: string) {
    return this.db.doc(`new-stocks/${stockId}`).valueChanges();
  }

  getStocks() {
    return this.stocks;
  }

  async addStock(stock: ProductStock) {
    const timestamp = this.timestampService.getTimestamp;

    await this.productService.updateProductQTY(stock.product, stock.quantity);

    stock.qrySupplied = this.timestampService.dateToTimestamp(stock.supplied);
    stock.created = stock.lastUpdate = timestamp;
    return await this.stockCol.add(stock);
  }

  deleteStock(stockId: string) {
    return this.db.doc(`new-stocks/${stockId}`).delete();
  }
}

