import { Component, OnInit } from '@angular/core';
import { AuthService } from '../modules/auth/services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // const potentialToken = localStorage.getItem('auth-token');
    // if (potentialToken === null) return;
    // const user = localStorage.getItem('permit');
    // if (user === null) return;
    // this.auth.user = JSON.parse(user);
    // this.auth.setToken(potentialToken);
  }

}
