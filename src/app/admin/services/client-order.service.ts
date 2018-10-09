import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Order } from '@shared/models/order.model';
import { SummarySaleService } from '@admin/services/summary-sale.service';
import { SummaryStaffOrdersService } from '@admin/services/summary-staff-orders.service';
import { TimestampService } from '@shared/services/timestamp.service';
import { ClientShoppingCartService } from '@client/services/client-shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class ClientOrderService {

  orderCol: AngularFirestoreCollection<Order>;
  orders: Observable<Order[]>;

  constructor(private db: AngularFirestore,
            private clientCartService: ClientShoppingCartService,
            private saleSummaryService: SummarySaleService,
            private timestampService: TimestampService,
            private orderSummaryService: SummaryStaffOrdersService) {
    this.orderCol = db.collection('client-orders');

    this.orders = this.orderCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Order;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getOrders() {
    return this.orders;
  }

  getOrdersByRange(TransactionDateRange) {

    console.log(TransactionDateRange);

    const startDate = this.timestampService.dateToTimestamp(TransactionDateRange.startDate);
    const endDate = this.timestampService.dateToTimestamp(TransactionDateRange.endDate);

    return this.db.collection('client-orders', ref => ref
      .where('datePlaced', '>=', startDate)
      .where('datePlaced', '<=', endDate))
      .valueChanges();
  }

  getPendingOrders() {
    return this.db.collection('client-orders', ref => ref
    .where('transactionDetails.transactionStatus', '==', 'PENDING')).valueChanges();
  }

  getOrder(orderId: string): Observable<Order> {
    return this.db.doc(`client-orders/${orderId}`).valueChanges();
  }

  // getUnremittedOrderByStaff(staffId: string) {
  //   return this.db.collection('staff-orders', ref => ref
  //     .where('transactionDetails.staff', '==', staffId).where('transactionDetails.balance', '<', 1))
  //     .snapshotChanges().pipe(
  //     map(change => {
  //       return change.map(a => {
  //         const data = a.payload.doc.data() as Order;
  //         data.id = a.payload.doc.id;

  //         return data;
  //       });
  //     })
  //   );
  // }

  private async orderSummaryCheck(docId) {
    const doc = await this.db.doc(`client-orders/${docId}`).ref.get();
    const data = doc.data() as Order;

    return doc.exists ? data : null;
  }

  async placeOrder(order: Order) {

    const date = this.timestampService.getTimestamp;

    order.datePlaced = order.lastUpdate = date;
    const result = await this.db.collection('client-orders').add(order);
    this.clientCartService.clearCart();

    const orderDetails = await this.orderSummaryCheck(result.id);
    if (orderDetails) {
      // update general summaries
      // this.updateSaleSummary(orderDetails);
      this.updateOrderSummary(orderDetails);

      console.log('timestamp', orderDetails);
    }

    return result;
  }

  private updateOrderSummary(order: Order) {
    const datePlaced = this.timestampService.timestampToDate(order.datePlaced);

    console.log('converted2', datePlaced);

    let totalQty = 0;
    order.items.forEach(item => {
      totalQty += item.quantity;
    });

    // console.log(totalQty);
    this.orderSummaryService.addOrUpdateSummary(datePlaced, totalQty);
  }

  updateOrderProductQty(clientOrder: Order, orderId: string) {
    return this.db.doc(`client-orders/${orderId}`).update(clientOrder);
  }

}
