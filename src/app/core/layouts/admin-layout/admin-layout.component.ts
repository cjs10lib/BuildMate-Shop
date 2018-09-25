import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Upload } from '@admin/models/upload.model';
import { AuthService } from '@shared/services/auth.service';
import { RoleService } from '@admin/services/role-service.service';
import { Staff } from '@admin/models/staff.model';
import { ClientOrderService } from '@admin/services/client-order.service';
import { ContactUsService } from '@client/services/contact-us.service';
import { StaffService } from '@admin/services/staff.service';
import { UploadService } from '@shared/services/upload.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  user$: Observable<Staff>;

  gallery: Upload[] = [];

  clientHeight: number;
  currentUrl: string;

  clientOrders;
  clientContact;

  notifications = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  isPhablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
    .pipe(
      map(result => result.matches)
    );

  combinedSubscription: Subscription;
  authSubscription: Subscription;
  uploadSubscription: Subscription;

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private auth: AuthService,
              private roleService: RoleService,
              private staffService: StaffService,
              private uploadService: UploadService,
              private clientOrderService: ClientOrderService,
              private contactUsService: ContactUsService) {
                this.clientHeight = window.innerHeight;
              }

  ngOnInit() {
    this.authSubscription = this.auth.user$.pipe(switchMap(state => {
      if (!state) { return; }

      return  this.roleService.getUser(state.uid);
    })).subscribe(user => {
      this.user$ = this.staffService.getStaff(user.staff);
    });

    // this.combinedSubscription = combineLatest(
    //   this.clientOrderService.getOrders(),
    //   this.contactUsService.getContacts(),
    //   this.uploadService.getAllGallery()
    //   ).subscribe(([order, contact, gallery]) => {
    //     this.clientOrders = order;
    //     this.clientContact = contact;
    //     this.gallery = gallery;

    //     this.notifications = this.clientOrders.length + this.clientContact.length;
    //   });

    this.uploadSubscription = this.uploadService.getAllGallery().subscribe(gallery => {
      this.gallery = gallery;
    });

    this.clientOrders = this.clientOrderService.getPendingOrders();
    this.clientContact = this.contactUsService.getPendingContacts();
  }

  ngOnDestroy(): void {
    if (this.combinedSubscription) {
      this.combinedSubscription.unsubscribe();
    }

    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }

  getUserAvatar(avatarId: string) {
    if (!avatarId) {
      return;
    }

    const index = this.gallery.findIndex(g => g.Id === avatarId);
    return this.gallery[index].url;
  }

  async signOut() {
    await this.auth.logout();
  }

}
