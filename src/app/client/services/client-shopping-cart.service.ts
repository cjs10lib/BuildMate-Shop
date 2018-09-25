import { TimestampService } from '@shared/services/timestamp.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Product } from '@shared/models/product.model';
import { CartItem } from '@shared/models/cartItem.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientShoppingCartService {

  constructor(private db: AngularFirestore,
              private timestampService: TimestampService) { }

  getCartTotalItemCount(cart) {
    let count = 0;
    count = cart.reduce(function(a, b) {
        return a + b.quantity;
      }, 0);

    return count;
  }

  getCartTotalPrice(cart) {
    let sum = 0;
    let unitPrice = 0;
    let unitQuantity = 0;

    for (const item of cart) {
      unitQuantity = item.quantity;
      unitPrice = item.product.unitPrice;

      sum += unitQuantity * unitPrice;
    }

    return sum;
  }

  private create() {
    return this.db.collection('client-shopping-carts').add(
      {
        createdDate: this.timestampService.getTimestamp
      }
    );
  }

  // get or create cart if none
  private async getOrCreateCartId() {
    const cartId = localStorage.getItem('clientCartId');
    if (cartId) { return cartId; }

    const cart = await this.create();
    localStorage.setItem('clientCartId', cart.id);
    return cart.id;
  }

   // returns all cart items
   async getCart(): Promise<Observable<CartItem[]>> {
    const cartId = await this.getOrCreateCartId();

    return this.db.collection('client-shopping-carts').doc(cartId).collection('items')
      .snapshotChanges().pipe(map(change => {
      return change.map(a => {
        const data = a.payload.doc.data() as CartItem;
        data.id = a.payload.doc.id;

        return data;
      });
    }));
  }

  // verify if cart item exists
  private async verifyCartItem(cartId, productId) {
    const doc = await this.db.doc(`client-shopping-carts/${cartId}/items/${productId}`).ref.get();
    const data = doc.data() as CartItem;

    return doc.exists ? data : null;
  }

  // cart item ref
  private cartItemRef(cartId, productId) {
    return this.db.doc(`client-shopping-carts/${cartId}/items/${productId}`);
  }

  // get specific cart item
  async getCartItem(productId: string) {
    const cartId = await this.getOrCreateCartId();
    return await this.verifyCartItem(cartId, productId);
  }

  // add to cart
  async addToCart(product: Product) {
    const cartId = await this.getOrCreateCartId();

    return this.cartItemRef(cartId, product.id).set({
      product: product,
      quantity: 1
    }, { merge: true });
  }

  // remove from cart
  async removeFromCart(product: Product) {
    const cartId = await this.getOrCreateCartId();
    const item$ = await this.verifyCartItem(cartId, product.id);

    if (item$.quantity > 1) {
      this.cartItemRef(cartId, product.id).set(
        { product: product, quantity: item$.quantity - 1 }
      );
    } else if (item$.quantity === 1) {
      this.cartItemRef(cartId, product.id).delete();
    }
  }

  // delete from cart
  async deleteFromCart(product: Product) {
    const cartId = await this.getOrCreateCartId();
    const item$ = await this.verifyCartItem(cartId, product.id);

    console.log(item$);

    if (item$) {
      this.cartItemRef(cartId, product.id).delete();
    }
  }

  // clear cart
  async clearCart() {
    const cartId = await this.getOrCreateCartId();

    const qry = await this.db.collection('client-shopping-carts').doc(cartId).collection('items').ref.get();
    const batch = this.db.firestore.batch();

    qry.forEach(doc => {
      batch.delete(doc.ref);
    });

    batch.commit();
  }
}
