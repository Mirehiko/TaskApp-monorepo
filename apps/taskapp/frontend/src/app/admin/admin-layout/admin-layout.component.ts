import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../modules/auth/services/auth.service';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  linkRoutes = [
    {
      url: ['/admin'],
      title: 'Dashboard'
    },
    {
      url: ['/admin', 'users'],
      title: 'Пользователи'
    },
    {
      url: ['/admin', 'roles'],
      title: 'Роли'
    },
    {
      url: ['/admin', 'categories'],
      title: 'Категории'
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // if (!this.authService.user.isAdmin) {
    //   this.router.navigate(['/login']);
    // }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
