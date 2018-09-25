import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SummarySale } from '@admin/models/summary-sales.model';
import { TimestampService } from '@shared/services/timestamp.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryNewStockService {

  private sumStockCol: AngularFirestoreCollection<SummarySale>;
  private sumStocks: Observable<SummarySale[]>;

  constructor(private db: AngularFirestore, private timestampService: TimestampService) {
    this.sumStockCol = db.collection('summary-stock');

    this.sumStocks = this.sumStockCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as SummarySale;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  private async stockSummaryCheck(docId) {
    const doc = await this.db.doc(`summary-stock/${docId}`).ref.get();
    const data = doc.data() as SummarySale;

    return doc.exists ? data : null;
  }

  private getStockSummaryId(suppliedDate: Date) {
    const jsDate = new Date(suppliedDate);
    const suppliedYear = (jsDate.toLocaleDateString('en', { year: 'numeric' }));
    const suppliedMonth = (jsDate.toLocaleDateString('en', { month: 'long' }));

    return { docId: suppliedYear + '-' + suppliedMonth, month: suppliedMonth, year: suppliedYear};
  }

  getStockSummary() {
    return this.sumStocks;
  }

  getStockSummaryCurrentMonth() {
    const docId = this.getStockSummaryId(new Date()).docId;
    return this.db.doc(`summary-stock/${docId}`).valueChanges();
  }

  async addOrUpdateSummary(suppliedDate: Date, quantity: number) {
    const docId = this.getStockSummaryId(suppliedDate).docId;
    const docMonth = this.getStockSummaryId(suppliedDate).month;

    // verify if record exists
    const isExist = await this.stockSummaryCheck(docId);

    return this.db.doc(`summary-stock/${docId}`)
      .set({
        month: docMonth,
        total: isExist ? isExist.total + quantity : quantity,
        lastUpdate: this.timestampService.getTimestamp // sets server timestamp
    }, { merge: true });

  }

}
