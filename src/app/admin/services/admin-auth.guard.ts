import { RoleService } from '@admin/services/role-service.service';
import { AuthService } from '@shared/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

    constructor(private auth: AuthService,
                private roleService: RoleService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.auth.user$.pipe(switchMap(user => this.roleService.getUser(user.uid)),
      map(staffAccount =>  {

      if (staffAccount) {
        return true;
      }
    }));
  }
}
