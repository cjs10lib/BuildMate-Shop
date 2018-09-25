import { Order } from '@shared/models/order.model';
import { ProductService } from '@shared/services/product.service';
import { TimestampService } from '@shared/services/timestamp.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
// import { ClientOrder } from '../models/client-order.model';
import { SummarySaleService } from '@admin/services/summary-sale.service';

@Injectable({
  providedIn: 'root'
})
export class ClientOrderRemitService {

  constructor(private db: AngularFirestore,
              private timestampService: TimestampService,
              private saleSummaryService: SummarySaleService,
              private productService: ProductService) { }

  private updateOrderStatus(order: Order, orderId: string) {
    return this.db.doc(`client-orders/${orderId}`).set(order, { merge: true });
  }

  private async updateSaleSummary(order: Order) {
    const totalAmount = order.transactionDetails.amountPaid;
    const datePlaced = this.timestampService.timestampToDate(order.datePlaced);

    await this.saleSummaryService.addOrUpdateSummary(datePlaced, totalAmount);
  }

  remitOrder(order: Order, orderId: string) {
    const data = this.db.doc(`client-order-remit/${orderId}`).set(order);
    this.updateOrderStatus(order, orderId);
    this.updateSaleSummary(order);

    // update qty for order products
    order.items.forEach(async item => {
      await this.productService.updateProductQTY(item.product.id, -item.quantity);
    });

    return data;
  }

}
