import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated()) {
      return of(true);
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          accessDenied: true,
        },
      });
      return of(false);
    }
  }
}
