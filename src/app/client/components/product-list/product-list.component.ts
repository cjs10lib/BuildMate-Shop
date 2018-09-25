import { Upload } from '@admin/models/upload.model';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { ClientShoppingCartService } from '@client/services/client-shopping-cart.service';
import { CartItem } from '@shared/models/cartItem.model';
import { Product } from '@shared/models/product.model';
import { ProductService } from '@shared/services/product.service';
import { UploadService } from '@shared/services/upload.service';
import { Subscription } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit,  OnDestroy {

  @Input() showBreadcrum = true;

  pageHeader = 'Our Products';
  pageText = ``;

  clientCart: CartItem[] = [];

  products: Product[] = [];
  gallery: Upload[] = [];

  datasource: Product[] = [];
  activePageDataChunk: Product[] = [];

  length = 1000;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 24, 100];

  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  subscription: Subscription;
  constructor(private productService: ProductService,
              private uploadService: UploadService,
              private clientCartService: ClientShoppingCartService) { }

  async ngOnInit() {
    this.subscription = (await this.clientCartService.getCart()).pipe(switchMap(cart => {
      this.clientCart = cart;

      return this.uploadService.getAllGallery();
    })).pipe(concatMap(gallery => {
      this.gallery = gallery;

      return this.productService.getProducts();
    })).subscribe(products => {
      this.products = products;

      this.length = products.length;

      this.datasource = products;
      this.activePageDataChunk = this.datasource.slice(0, this.pageSize);

      console.log(products);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  onPageChanged(e) {
    const firstCut = e.pageIndex * e.pageSize;
    const secondCut = firstCut + e.pageSize;
    this.activePageDataChunk = this.datasource.slice(firstCut, secondCut);
  }


  getProductAvatar(avatarId: string) {
    if (!avatarId) { return; }

    const index = this.gallery.findIndex(g => g.Id === avatarId);
    return this.gallery[index].url;
  }

}
