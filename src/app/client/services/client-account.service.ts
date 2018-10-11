import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Client } from '@client/models/client.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientAccountService {

  clientCol: AngularFirestoreCollection<Client>;
  clients: Observable<Client[]>;

  constructor(private db: AngularFirestore) {
    this.clientCol = db.collection('client-account');

    this.clients = this.clientCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Client;
          data.uid = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getClients() {
    return this.clients;
  }

  getClient(clientId: string): Observable<Client> {
    return this.db.doc(`client-account/${clientId}`).valueChanges();
  }

  addClient(client: Client[]) {
    const uid = client[0].uid;
    const clientData = client[0];

    return this.db.doc(`client-account/${uid}`).set(clientData, { merge: true });
  }
}
