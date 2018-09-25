import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

import { ClientAccountService } from '@client/services/client-account.service';
import { ClientShoppingCartService } from '@client/services/client-shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>;

  constructor(private auth: AngularFireAuth,
              private router: Router,
              private clientService: ClientAccountService,
              private clientCartService: ClientShoppingCartService) {
                this.user$ = auth.authState;
              }

  async login(email: string, password: string) {
    const user = await this.auth.auth.signInWithEmailAndPassword(email, password);
    this.router.navigate(['account', 'dashboard']);
    return user.user.uid;
  }

  async loginFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    const signIn = await firebase.auth().signInWithPopup(provider);
    console.log(signIn.user);

    return signIn;
  }


  async logout() {
    const user = await this.auth.auth.signOut();
    await this.clientCartService.clearCart(); // clears cart after logout
    this.router.navigate(['/']);

    return user;
  }

  async emailSignUp(email: string, password: string) {
    const user = await this.auth.auth.createUserWithEmailAndPassword(email, password);
    return user.user.uid;
  }
}
