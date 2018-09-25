import { Component, OnInit } from '@angular/core';

import { RoleService } from '@admin/services/role-service.service';
import { AuthService } from '@shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-login',
  templateUrl: './new-login.component.html',
  styleUrls: ['./new-login.component.scss']
})
export class NewLoginComponent implements OnInit {

  error: string;

  details = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService,
              private roleService: RoleService,
              private router: Router) { }

  ngOnInit() {}

  async loginStaff() {
    try {
      await this.authService.login(this.details.username, this.details.password);
    } catch (error) {
      this.error = error.code;
    }
    // this.router.navigate(['account', 'dashboard']);
  }

}


