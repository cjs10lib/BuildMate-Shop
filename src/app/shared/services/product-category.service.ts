import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Category } from '@shared/models/category.model';
import { TimestampService } from '@shared/services/timestamp.service';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private categoryCol: AngularFirestoreCollection<Category>;
  private categories: Observable<Category[]>;

  constructor(private db: AngularFirestore, private timestampService: TimestampService) {
    this.categoryCol = db.collection('categories');

    this.categories = this.categoryCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Category;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getCategories() {
    return this.categories;
  }

  addCategory(category: Category) {
    const timestamp = this.timestampService.getTimestamp;

    category.created = category.lastUpdate = timestamp;
    return this.categoryCol.add(category);
  }
}


