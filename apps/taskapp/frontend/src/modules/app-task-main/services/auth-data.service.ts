import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { AuthRestService } from '../../auth/services/rest/auth-rest.service';
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class AuthDataService extends AuthService {
  public menu: any;

  constructor(authRestService: AuthRestService, router: Router) {
    super(authRestService, router);
  }
}
