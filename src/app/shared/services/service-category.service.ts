import { map } from 'rxjs/operators';
import { Observable, Timestamp } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Service } from '@shared/models/service.model';
import { TimestampService } from '@shared/services/timestamp.service';
import { UploadService } from '@shared/services/upload.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {
  private serviceCol: AngularFirestoreCollection<Service>;
  private services: Observable<Service[]>;

  constructor(private db: AngularFirestore,
              private timestampService: TimestampService,
              private uploadService: UploadService) {
    this.serviceCol = db.collection('services');

    this.services = this.serviceCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Service;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getServiceCategories() {
    return this.services;
  }

  getServiceCategory(serviceId: string) {
    return this.db.doc(`services/${serviceId}`).valueChanges();
  }

  addService(service: Service) {
    const timestamp = this.timestampService.getTimestamp;

    const avatarId = this.db.createId();

    service.avatar = avatarId;
    service.created = service.lastUpdate = timestamp;
    const serviceData = this.serviceCol.add(service);

    return { service: serviceData, avatar: avatarId };
  }

  async deleteService(service: Service, serviceId: string) {
    this.uploadService.deleteFileData(service.avatar);
    return await this.db.doc(`services/${serviceId}`).delete();
  }

}


