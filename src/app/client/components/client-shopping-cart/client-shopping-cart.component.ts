import { Client } from '@client/models/client.model';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Product } from '@shared/models/product.model';
import { Upload } from '@admin/models/upload.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from '@admin/services/shopping-cart.service';
import { ProductService } from '@shared/services/product.service';
import { AlertService } from '@shared/services/alert.service';
import { UploadService } from '@shared/services/upload.service';
import { switchMap, concatMap } from 'rxjs/operators';
import { CartItem } from '@shared/models/cartItem.model';
import { ClientShoppingCartService } from '@client/services/client-shopping-cart.service';

@Component({
  selector: 'app-client-shopping-cart',
  templateUrl: './client-shopping-cart.component.html',
  styleUrls: ['./client-shopping-cart.component.scss']
})
export class ClientShoppingCartComponent implements OnInit, OnDestroy {

  @Input() hideControls = false;

  cartMap = [];
  cart: CartItem[] = [];
  products: Product[] = [];

  galleryFiles: Upload[] = [];

  displayedColumns: string[] = ['image', 'product', 'quantity', 'total'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  subscription: Subscription;
  cartSubcription: Subscription;
  productSubsciption: Subscription;

  constructor(private clientCartService: ClientShoppingCartService,
    private productService: ProductService,
    private alertService: AlertService,
    private uploadService: UploadService) { }

  async ngOnInit() {

    this.subscription = this.uploadService.getAllGallery().pipe(concatMap(gallery => {
      this.galleryFiles = gallery;
      this.showSpinner = false;
      console.log(gallery);

      return this.productService.getProducts();
    })).pipe(concatMap(async products => {
      this.products = products;
      console.log(products);

      return (await this.clientCartService.getCart());
    })).pipe(concatMap(cartItems => {
      return cartItems;

    })).subscribe(cart => {
      this.cart = cart;
      console.log(cart);

      this.cartMap = cart.map(c => {
        return {
          avatar: c.product.avatar,
          product: c.product.id,
          quantity: c.quantity,
          total: c.product.unitPrice * c.quantity
        };
      });

      this.dataSource = new MatTableDataSource(this.cartMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  ngOnDestroy(): void {
    if (this.cartSubcription) {
      this.cartSubcription.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAvatarDetails(avatarId: string) {
    if (!avatarId) {
      return;
    }

    const index = this.galleryFiles.findIndex(g => g.Id === avatarId);
    return this.galleryFiles[index].url;
  }

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.cartMap.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTotalItemCount() {
    return this.clientCartService.getCartTotalItemCount(this.cart);
  }

  getProductDetails(productId: string) {
    if (!productId) {
      return;
    }

    const index = this.products.findIndex(p => p.id === productId);
    return this.products[index].pattern;
  }

  async clearCart() {
    const confirm = await this.alertService.confirmDelete();
    if (confirm.value) {
      await this.clientCartService.clearCart();

      this.alertService.afterDeleteSuccess();
    }
  }

}
