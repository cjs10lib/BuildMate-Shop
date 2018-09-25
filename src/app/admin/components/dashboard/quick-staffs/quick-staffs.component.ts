import { Upload } from '@admin/models/upload.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';

import { Staff } from '@admin/models/staff.model';
import { StaffService } from '@admin/services/staff.service';
import { switchMap } from 'rxjs/operators';
import { UploadService } from '@shared/services/upload.service';

@Component({
  selector: 'app-quick-staffs',
  templateUrl: './quick-staffs.component.html',
  styleUrls: ['./quick-staffs.component.scss']
})
export class QuickStaffsComponent implements OnInit, OnDestroy {

  staffMap = [];
  staffs: Staff[] = [];
  galleryFiles: Upload[] = [];

  displayedColumns: string[] = ['avatar', 'staff', 'phone'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showSpinner = true;
  subscription: Subscription;
  staffSubscription: Subscription;

  constructor(private staffService: StaffService,
              private uploadService: UploadService) {

                this.subscription = this.uploadService.getAllGallery().subscribe(gallery => {
                  this.galleryFiles = gallery;
                });
              }

  ngOnInit() {

    this.staffSubscription = this.staffService.getStaffs().subscribe(resp => {
      this.staffs = resp;
      this.showSpinner = false;

      this.staffMap = resp.map(s => {
        return {
          avatar: s.avatar,
          staff: s.names,
          phone: s.contact.phone
        };
      });

      this.dataSource = new MatTableDataSource(this.staffMap);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.staffSubscription) {
      this.staffSubscription.unsubscribe();
    }
  }

  getAvatarDetails(avatarId: string) {
    if (!avatarId) {
      return;
    }

    const index = this.galleryFiles.findIndex(g => g.Id === avatarId);
    return this.galleryFiles[index].url;
  }

}
