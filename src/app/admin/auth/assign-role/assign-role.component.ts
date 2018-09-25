import { RoleService } from '@admin/services/role-service.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { StaffAccount } from '@admin/models/account.model';
import { AlertService } from '@shared/services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '@shared/services/auth.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assign-role',
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.css']
})
export class AssignRoleComponent implements OnInit, OnDestroy {

  account: StaffAccount = {
    login: {},
  };

  staffAccount: StaffAccount = {}; // current loggin staff right;

  subscription: Subscription;
  roleSubscription: Subscription;

  constructor(private roleService: RoleService,
              private alertService: AlertService,
              private dialogRef: MatDialogRef<AssignRoleComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private auth: AuthService) { }

  ngOnInit() {
    // default value
    this.account.right = 'AD';
    this.account.staff = this.data.id;
    this.account.login.email = this.data.contact.email;

    this.subscription =  this.auth.user$.subscribe(staffAccount => {
      this.roleSubscription = this.roleService.getUser(staffAccount.uid).subscribe(account => {
        this.staffAccount = account;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  async addRole() {
    const confirm = await this.alertService.confirmUpdate();
    if (confirm.value) {
      const uid = await this.auth.emailSignUp(this.account.login.email, this.account.login.password);

      this.account.uid = uid;
      await this.roleService.addRole(this.account);

      this.alertService.afterUpdateSuccess();
      this.dialogRef.close();
    }
  }

  async deleteRole() {
    const staffId = this.data.id;

    const confirm = await this.alertService.confirmDelete();
    if (confirm.value) {
      this.roleService.deleteRole(staffId);
      this.alertService.afterDeleteSuccess();

      this.dialogRef.close();
    }
  }

}


