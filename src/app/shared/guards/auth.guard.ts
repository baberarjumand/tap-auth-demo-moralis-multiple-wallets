import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // return this.authService.isAuthenticated$.pipe(
    //   take(1),
    //   map((val) => {
    //     if (!val) {
    //       this.router.navigate(['login']);
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   })
    // );

    if (this.authService.getCurrentUser()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
