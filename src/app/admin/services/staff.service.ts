import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Staff } from '@admin/models/staff.model';
import { TimestampService } from '@shared/services/timestamp.service';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private staffCol: AngularFirestoreCollection<Staff>;
  private staffs: Observable<Staff[]>;

  constructor(private db: AngularFirestore, private timestampService: TimestampService) {
    this.staffCol = db.collection('staffs');

    this.staffs = this.staffCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Staff;
          data.id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getStaffs() {
    return this.staffs;
  }

  getStaff(staffId: string): Observable<Staff> {
    return this.db.doc(`staffs/${staffId}`).valueChanges();
  }

  addStaff(staff: Staff) {
    const timestamp = this.timestampService.getTimestamp;

    const avatarId = this.db.createId();

    staff.avatar = avatarId;
    staff.created = staff.lastUpdate = timestamp;
    const staffData = this.staffCol.add(staff);

    return { staff: staffData, avatar: avatarId };
  }

  updateStaff(staffId: string, staff: Staff) {
    const timestamp = this.timestampService.getTimestamp;

    staff.lastUpdate = timestamp;
    this.db.doc(`staffs/${staffId}`).set(staff, { merge: true });
  }

  deleteStaff(staffId: string) {
    return this.db.doc(`staffs/${staffId}`).delete();
  }
}



