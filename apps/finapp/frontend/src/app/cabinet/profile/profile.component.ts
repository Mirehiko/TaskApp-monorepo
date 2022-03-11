import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: User;
  uSub: Subscription;
  isLoading = true;

  constructor(
    private uService: UserRestService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.uSub = this.uService.getUserById(this.authService.user._id)
      .subscribe(
        user => {
          this.user = user;
          this.isLoading = false;
        },
        err => console.log(err)
      );
  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
}
