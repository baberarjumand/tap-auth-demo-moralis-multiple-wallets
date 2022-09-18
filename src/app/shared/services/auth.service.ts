import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

// eslint-disable-next-line @typescript-eslint/naming-convention
import Moralis from 'moralis-v1';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject(false);
  currentUser$ = new BehaviorSubject(null);

  constructor(private router: Router) {
    this.initializeMoraslis();
  }

  initializeMoraslis() {
    const serverUrl = environment.MORALIS_DAPP_SERVER_URL;
    const appId = environment.MORALIS_APP_ID;
    Moralis.start({ serverUrl, appId });
    this.currentUser$.next(Moralis.User.current());

    Moralis.onAccountChanged(async (account) => {
      const confirmed = confirm('Link New Wallet?');

      if (confirmed) {
        await Moralis.link(account);
        console.log('Wallet Linked Successfully!', Moralis.User.current());
        this.currentUser$.next(Moralis.User.current());
        window.location.reload();
      }
    });
  }

  login() {
    this.isAuthenticated$.next(true);
    this.router.navigate(['']);
  }

  getCurrentUser() {
    return Moralis.User.current();
  }

  async loginWithMetamask() {
    try {
      const authResponse = await Moralis.authenticate({
        signingMessage: 'Log in to Tutorial App using Metamask',
      });
      console.log('Sign In With Metamask successful!:', authResponse);
      this.isAuthenticated$.next(true);
      this.currentUser$.next(Moralis.User.current());
      this.router.navigate(['']);
    } catch (err) {
      this.isAuthenticated$.next(false);
      this.currentUser$.next(null);

      if (err.message === 'Non ethereum enabled browser') {
        alert('Please install the Metamask Extension');
      } else if (err.code === 4001) {
        alert('Please try logging in again with Metamask.');
      } else {
        console.error('Error logging in Metamask:', err);
      }
    }
  }

  async loginWithWalletConnect() {
    try {
      const authResponse = await Moralis.authenticate({
        provider: 'walletconnect',
        signingMessage: 'Log in to Tutorial App using WalletConnect',
        mobileLinks: [
          'rainbow',
          'metamask',
          'argent',
          'trust',
          'imtoken',
          'pillar',
        ],
      });
      console.log('Sign In With WalletConnect successful!:', authResponse);
      this.isAuthenticated$.next(true);
      this.currentUser$.next(Moralis.User.current());
      this.router.navigate(['']);
    } catch (err) {
      this.isAuthenticated$.next(false);
      this.currentUser$.next(null);

      if (err.message === 'Non ethereum enabled browser') {
        alert('Please install the Metamask Extension');
      } else if (err.code === 4001) {
        alert('Please try logging in again with WalletConnect.');
      } else {
        console.error('Error logging in WalletConnect:', err);
      }
    }
  }

  async logOut() {
    try {
      await Moralis.User.logOut();
      this.isAuthenticated$.next(false);
      this.currentUser$.next(null);
      localStorage.removeItem('walletconnect');
      this.router.navigate(['login']);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  }
}
