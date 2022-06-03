import { Component, OnInit } from '@angular/core';
import { SocketNotificationService } from '../services/socket-notification.service';
import { AuthService } from '../../auth/services/auth.service';
import { TaskRestService } from '../services/rest/task-rest.service';
import { TaskResponseDto } from '@finapp/app-common';
import { map, Observable } from 'rxjs';


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

  task: TaskResponseDto;
  sub: Observable<any>

  constructor(
    private authService: AuthService,
    private taskRestService: TaskRestService,
    private socketService: SocketNotificationService,
  ) { }

  ngOnInit(): void {

    // this.socketService.connectToNotify();
    // this.analyticsService.userShotInfo(this.authService.user.id)
    //   .subscribe(data => {
    //     console.log(data);
    //     this.balance = data.total;
    //     this.cash = data.cashTotal;
    //     this.savings = data.savingTotal;
    //   });

    this.socketService.getTaskChangedNotification().subscribe((data: TaskResponseDto) => {
      console.log(data);
      // this.task = data;
    });

  }

  async getData(): Promise<void> {
    this.task = await this.taskRestService.update(100, {
      name: 'FrontTests'
    });
    this.socketService.sendTaskChangedNotification(this.task)
  }

}
