import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Subscription } from 'rxjs';

import { Staff } from '@admin/models/staff.model';
import { AlertService } from '@shared/services/alert.service';
import { TimestampService } from '@shared/services/timestamp.service';
import { UploadService } from '@shared/services/upload.service';
import { StaffService } from '@admin/services/staff.service';

@Component({
  selector: 'app-staff-form',
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.scss']
})
export class StaffFormComponent implements OnInit, OnDestroy {

  staff: Staff = {
    contact: {}
  };

  staffId: string;

  step = 0;

  imageUrl = '../../../../assets/avatars/avatar3.png';
  fileToUpload: File[] = [];
  uploadError;
  isHovering: boolean;

  subscription: Subscription;

  constructor(private staffService: StaffService,
              private alertService: AlertService,
              private route: ActivatedRoute,
              private timestampService: TimestampService,
              private router: Router,
              private uploadService: UploadService,
              private ng2ImgMax: Ng2ImgMaxService,
              public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.staffId = this.route.parent.snapshot.paramMap.get('id');

    if (this.staffId) {
      this.subscription = this.staffService.getStaff(this.staffId).subscribe(resp => {
        this.staff = resp;
        this.staff.dob = this.timestampService.timestampToDate(resp.dob);
      });
    }
  }

  ngOnDestroy(): void {
   if (this.subscription) {
     this.subscription.unsubscribe();
   }
  }

  async onSubmit() {
    const confirm = await this.alertService.confirmUpdate();
    if (confirm.value) {

      if (this.staffId) {
        await this.staffService.updateStaff(this.staffId, this.staff);

        this.alertService.afterUpdateSuccess();
        this.router.navigate(['account', 'staffs']);
        return;
      }

      // else
      const staffData = await this.staffService.addStaff(this.staff);
      const staffId = (await staffData.staff).id;
      const avatar = staffData.avatar;

      this.uploadService.pushUpload(this.fileToUpload, staffId, 'STAFF', avatar);

      this.alertService.afterUpdateSuccess();
      this.router.navigate(['account', 'staffs']);
    }
  }

  toggleHover($event: boolean) {
    this.isHovering = $event;
  }

  onImageChange(event) {
    const image: File = event.target.files[0];
    this.uploadError = null;

    if (image.size > 512000) {
      this.uploadError = 'File should not exceed 500KB';
      console.log('😢 File should not exceed 500KB');
      return;
    }

    this.ng2ImgMax.compressImage(image, 0.010).subscribe(
      result => {
        this.fileToUpload.push(new File([result], result.name));
        this.getImagePreview(this.fileToUpload[0]);
      },
      error => {
        this.uploadError = error.reason;
        console.log('😢 Oh no!', error);
      }
    );
  }

  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageUrl = reader.result.toString();
    };
  }

  // handleFileInput(file: FileList) {
  //   this.fileToUpload = file;

  //   // if (this.fileToUpload.item(0).type !== 'image') {
  //   //   console.log('unsupported file type :( ');
  //   // }

  //   // show image preview
  //   const reader = new FileReader();
  //   reader.onload = (event: any) => {
  //     this.imageUrl = event.target.result;
  //   };
  //   reader.readAsDataURL(this.fileToUpload.item(0));
  // }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
