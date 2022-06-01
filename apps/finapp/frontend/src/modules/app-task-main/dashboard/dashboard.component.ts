import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../app/shared/services/auth.service';


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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.analyticsService.userShotInfo(this.authService.user._id)
    //   .subscribe(data => {
    //     console.log(data);
    //     this.balance = data.total;
    //     this.cash = data.cashTotal;
    //     this.savings = data.savingTotal;
    //   });
  }

}
