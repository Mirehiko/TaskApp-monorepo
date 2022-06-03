import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../modules/auth/services/auth.service';


@Component({
  selector: 'app-cabinet-layout',
  templateUrl: './cabinet-layout.component.html',
  styleUrls: ['./cabinet-layout.component.scss']
})
export class CabinetLayoutComponent implements OnInit {
  isAdmin = false;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // this.isAdmin = this.authService.user.isAdmin;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
