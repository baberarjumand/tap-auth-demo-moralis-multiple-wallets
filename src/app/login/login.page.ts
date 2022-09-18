import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  logIn() {
    this.authService.login();
  }

  logInWithMetamask() {
    this.authService.loginWithMetamask();
  }

  logInWithWalletConnect() {
    this.authService.loginWithWalletConnect();
  }
}
