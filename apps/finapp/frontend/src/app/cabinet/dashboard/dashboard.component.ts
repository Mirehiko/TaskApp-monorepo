import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { AnalyticsService } from '../../shared/services/analytics.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  balance = 0;
  cards: any = {};
  contributions: any = {};
  cash: any = {};
  credits: any = {};
  savings: any = {};

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.analyticsService.userShotInfo(this.authService.user.id)
      .subscribe(data => {
        console.log(data);
        this.balance = data.total;
        this.cash = data.cashTotal;
        this.savings = data.savingTotal;
      });
  }

}
