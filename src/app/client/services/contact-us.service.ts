import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { ContactUs } from '@client/models/contact-us.model';
import { TimestampService } from '@shared/services/timestamp.service';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  private contactCol: AngularFirestoreCollection<ContactUs>;
  private contacts: Observable<ContactUs[]>;

  constructor(private db: AngularFirestore,
              private timestampService: TimestampService) {
    this.contactCol = this.db.collection('contact-us');

    this.contacts = this.contactCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as ContactUs;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getContacts() {
    return this.contacts;
  }

  getPendingContacts() {
    return this.db.collection('contact-us', ref => ref.where('resolved', '==', false)).valueChanges();
  }

  addContact(contact: ContactUs) {
    const date = this.timestampService.getTimestamp;

    contact.created = contact.lastUpdate = date;
    return this.contactCol.add(contact);
  }

  updateContact(contactId: string) {
    const date = this.timestampService.getTimestamp;

    return this.db.doc(`contact-us/${contactId}`).set({
      resolved: true,
      lastUpdate: date
    }, { merge: true });
  }
}


