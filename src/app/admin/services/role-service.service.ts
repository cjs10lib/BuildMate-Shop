import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { StaffAccount } from '@admin/models/account.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private db: AngularFirestore) { }

  getUser(uid: string): Observable<StaffAccount> {
    return this.db.doc(`staff-account/${uid}`).valueChanges();
  }

  addRole(role: StaffAccount) {
    return this.db.doc(`staff-account/${role.uid}`).set(role);
  }

  deleteRole(staffId: string) {
    return this.db.doc(`staff-account/${staffId}`).delete();
  }
}
