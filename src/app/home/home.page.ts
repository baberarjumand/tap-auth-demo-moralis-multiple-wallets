import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  currentUser;
  currentUserSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // this.currentUser = this.authService.getCurrentUser();

    this.currentUserSub = this.authService.currentUser$.subscribe(
      (val) => (this.currentUser = val)
    );
  }

  ngOnDestroy(): void {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
  }

  addMetamaskWallet() {
    this.authService.loginWithMetamask();
  }

  logOut() {
    this.authService.logOut();
  }
}
