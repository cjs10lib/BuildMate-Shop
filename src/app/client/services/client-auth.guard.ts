import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.user$.pipe(map(user => {
        if (user && user.providerData[0].providerId === 'facebook.com') { return true; }

        // else login with facebook
        this.auth.loginFacebook().then(auth => {
          this.router.navigate(['shopping-cart']);
        });
        return false;
      }));
  }
}
