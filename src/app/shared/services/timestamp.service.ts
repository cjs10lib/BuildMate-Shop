import { Injectable } from '@angular/core';
// import Timestamp = require('firebase-firestore-timestamp');
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class TimestampService {

  constructor() { }

  get getTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  timestampToDate(tstamp) {
    const Timestamp = require('firebase-firestore-timestamp');
    const stamp = new Timestamp(tstamp).seconds * 1000;
    return new Date(stamp);
  }

  dateToTimestamp(date) {
    const time = new Date(date);
    const timestamp = this.removeDigits(time.getTime(), 3);
    return timestamp;
  }

  private removeDigits(x, n) {
    return (x - (x % Math.pow(10, n))) / Math.pow(10, n);
  }
}
