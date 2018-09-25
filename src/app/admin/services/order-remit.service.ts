import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Order } from '@shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderRemitService {

  constructor(private db: AngularFirestore) { }

  remitOrder(orders: Order, orderId: string) {
    const data = this.db.doc(`staff-order-remit/${orderId}`).set(orders);
    this.updateOrderStatus(orders, orderId);

    console.log(orders);

    return data;
  }

  updateOrderStatus(orderRemit: Order, orderId: string) {
    return this.db.doc(`staff-orders/${orderId}`).set(orderRemit);
  }
}
