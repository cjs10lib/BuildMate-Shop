import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { SummarySale } from '@admin/models/summary-sales.model';
import { Observable } from 'rxjs';
import { TimestampService } from '@shared/services/timestamp.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SummaryStaffOrdersService {

  private sumOrderCol: AngularFirestoreCollection<SummarySale>;
  private sumOrders: Observable<SummarySale[]>;

  constructor(private db: AngularFirestore, private timestampService: TimestampService) {
    this.sumOrderCol = db.collection('summary-orders');

    this.sumOrders = this.sumOrderCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as SummarySale;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  private async orderSummaryCheck(docId) {
    const doc = await this.db.doc(`summary-orders/${docId}`).ref.get();
    const data = doc.data() as SummarySale;

    return doc.exists ? data : null;
  }

  private getOrderSummaryId(orderDate: Date) {
    const jsDate = new Date(orderDate);
    const suppliedYear = (jsDate.toLocaleDateString('en', { year: 'numeric' }));
    const suppliedMonth = (jsDate.toLocaleDateString('en', { month: 'long' }));

    return { docId: suppliedYear + '-' + suppliedMonth, month: suppliedMonth, year: suppliedYear};
  }

  getOrderSummary() {
    return this.sumOrders;
  }

  getOrderSummaryCurrentMonth() {
    const docId = this.getOrderSummaryId(new Date()).docId;
    return this.db.doc(`summary-orders/${docId}`).valueChanges();
    // return this.db.collection('summary-orders', ref => ref.where('month', '==', currentMonth)).valueChanges();
  }

  async addOrUpdateSummary(orderDate: Date, quantity: number) {
    const docId = this.getOrderSummaryId(orderDate).docId;
    const docMonth = this.getOrderSummaryId(orderDate).month;

    // verify if record exists
    const isExist = await this.orderSummaryCheck(docId);

    return this.db.doc(`summary-orders/${docId}`)
      .set({
        month: docMonth,
        total: isExist ? isExist.total + quantity : quantity,
        lastUpdate: this.timestampService.getTimestamp // sets server timestamp
    }, { merge: true });

  }

}
