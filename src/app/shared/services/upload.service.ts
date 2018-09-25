import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { Upload } from '@admin/models/upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  basePath = 'gallery';

  uploadTask: AngularFireUploadTask;

  fileToUpload: Upload = {};
  storageRef = this.storage;

  percentageArray;

  uploadCollection: AngularFirestoreCollection<Upload>;
  uploads$: Observable<Upload[]>;

  private percentage: Observable<number>;
  private snapshot: Observable<any>;

  imagePath;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private route: ActivatedRoute) {

  }

  getAllGallery() {
    return this.uploads$ = this.db.collection('gallery').snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Upload;
          data.Id = a.payload.doc.id;

          return data;
        });
      }));
  }

  private uploadPath(person: string, basePath: string) {
    return `${basePath}/${person}/${person}_${new Date().getTime()}`;
  }

  private saveFileData(fileToUpload: Upload, fileId?: string) {

    // if fileId is not included in parameter, generate new fileId

    const newFileId = this.db.createId();
    return this.db.doc(`gallery/${fileId ? fileId : newFileId}`).set(fileToUpload);
  }

  private deleteFileStorage(path: string) {
    return this.storageRef.ref(path).delete().pipe(take(1)).subscribe();
  }

  getUploadFile(path: string) {
    return this.storageRef.ref(path).getDownloadURL();
  }

  getSourceAvatar(profileImgId: string): Observable<Upload> {
    return this.db.doc(`gallery/${profileImgId}`).valueChanges();
  }

  async pushUpload(fileToUpload: File[], sourceId: string, uploadTag: string, avatar?: string) {

    console.log('file upload service', fileToUpload);

    Array.from(fileToUpload).forEach(file => {

      const path = this.uploadPath(sourceId, this.basePath);
      const fileRef = this.storageRef.ref(path);

      const customMetadata = { app: 'buildMate-Shop!' };

      // if (file.type.split('/')[0] !== 'image') {
      //   console.log('Unsupported file type :(' );
      //   return;
      // }

      this.uploadTask = this.storageRef.upload(path, file, {
        customMetadata: customMetadata
      });

      this.storageRef.upload(path, file, { customMetadata: customMetadata });

      this.percentage = this.uploadTask.percentageChanges();
      this.snapshot = this.uploadTask.snapshotChanges();

      this.uploadTask.snapshotChanges().pipe(finalize(() => {

        const downloadURL = fileRef.getDownloadURL();

        downloadURL.subscribe(url => {

          this.fileToUpload.sourceId = sourceId;
          this.fileToUpload.tag = uploadTag;
          this.fileToUpload.url = url;
          this.fileToUpload.path = path;
          this.fileToUpload.createdDate = new Date();

          console.log(url);

          this.saveFileData(this.fileToUpload, avatar); // save file data to firestore gallery
        });
      })).subscribe();

    });

    this.fileToUpload = {};
  }

  async deleteFileData(fileId: string) {
    const avatarFile = await this.db.doc(`gallery/${fileId}`).ref.get();
    const data = avatarFile.data() as Upload;

    this.deleteFileStorage(data.path);
    return await this.db.doc(`gallery/${fileId}`).delete();
  }
}


