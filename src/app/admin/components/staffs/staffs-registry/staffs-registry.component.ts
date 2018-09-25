import { SummarySale } from '@admin/models/summary-sales.model';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Staff } from '@admin/models/staff.model';
import { UploadService } from '@shared/services/upload.service';
import { Upload } from '@admin/models/upload.model';
import { StaffService } from '@admin/services/staff.service';

@Component({
  selector: 'app-staffs-registry',
  templateUrl: './staffs-registry.component.html',
  styleUrls: ['./staffs-registry.component.css']
})
export class StaffsRegistryComponent implements OnInit, OnDestroy {

  // search Qry
  searchQry: string;

  staffs: Staff[] = [];
  filteredStaffs: Staff[] = [];

  galleryFiles: Upload[] = [];

  showSpinner = true;
  subscription: Subscription;
  gallerySubscription: Subscription;

  constructor(private staffService: StaffService,
              private uploadService: UploadService) { }

  ngOnInit() {
    // this.subscription = this.staffService.getStaffs().subscribe(resp => {
    //   this.showSpinner = false;
    //   this.staffs = this.filteredStaffs = resp;
    // });

    this.subscription = this.uploadService.getAllGallery().pipe(switchMap(resp => {
      this.galleryFiles = resp;
      this.showSpinner = false;

      return this.staffService.getStaffs();
    })).subscribe(result => {
      this.staffs = this.filteredStaffs = result;
    });

  }

  ngOnDestroy(): void {
   if (this.subscription) {
     this.subscription.unsubscribe();
   }

   if (this.gallerySubscription) {
     this.gallerySubscription.unsubscribe();
   }
  }

  getAvatarDetails(avatarId: string) {
    if (!avatarId) {
      return;
    }

    const index = this.galleryFiles.findIndex(g => g.Id === avatarId);
    return this.galleryFiles[index].url;
  }

  search(qry: string) {

    this.filteredStaffs = qry ?
    this.staffs.filter(
      p => p.names.toLowerCase().includes(qry.toLowerCase())) : this.staffs;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
