import { ServiceCategoryService } from '@shared/services/service-category.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { switchMap, concatMap } from 'rxjs/operators';

import { Category } from '@shared/models/category.model';
import { Upload } from '@admin/models/upload.model';
import { Product } from '@shared/models/product.model';
import { ProductCategoryService } from '@shared/services/product-category.service';
import { ProductService } from '@shared/services/product.service';
import { UploadService } from '@shared/services/upload.service';
import { Service } from '@shared/models/service.model';

@Component({
  selector: 'app-quick-products',
  templateUrl: './quick-products.component.html',
  styleUrls: ['./quick-products.component.scss']
})
export class QuickProductsComponent implements OnInit, OnDestroy {

  productMap = [];
  products: Product[] = [];

  categories: Service[] = [];

  galleryFiles: Upload[] = [];

  displayedColumns: string[] = ['avatar', 'pattern', 'unitPrice', 'availableQTY', 'category'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  subscription: Subscription;

  constructor(private productService: ProductService,
              private uploadService: UploadService,
              private serviceCategoryService: ServiceCategoryService) { }

  ngOnInit() {
    this.subscription = this.uploadService.getAllGallery().pipe(concatMap(gallery => {
      this.showSpinner = false;
      this.galleryFiles = gallery;

      console.log('gallery', gallery);

      return this.serviceCategoryService.getServiceCategories();
    })).pipe(concatMap(categories => {
      this.categories = categories;

      console.log('categories', categories);

      return this.productService.getProducts();
    })).subscribe(products => {
      this.products = products;

      console.log(products);

      this.productMap = products.map(p => {
        return {
          avatar: p.avatar,
          pattern: p.pattern,
          unitPrice: p.unitPrice,
          availableQTY: p.availableQTY,
          category: p.category
        };
      });

      this.dataSource = new MatTableDataSource(this.productMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy(): void {
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

  getCategoryDetails(categoryId: string) {
    if (!categoryId) {
      return;
    }

    const index = this.categories.findIndex(c => c.id === categoryId);
    return this.categories[index].category;
  }

}
