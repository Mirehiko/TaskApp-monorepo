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
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    if ( await this.auth.isAuthenticated()) {
      return of(true);
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: {
          accessDenied: true,
        },
      });
      return of(false);
    }
  }

  // canActivateChild(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean> | Promise<boolean> | boolean {
  //   if (this.auth.isAuthenticated()) {
  //     return of(true);
  //   } else {
  //     this.router.navigate(['/auth/login'], {
  //       queryParams: {
  //         accessDenied: true,
  //       },
  //     });
  //     return of(false);
  //   }
  // }
}
