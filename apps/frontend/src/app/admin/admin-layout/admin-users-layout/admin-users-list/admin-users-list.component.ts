import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces';
import { UserService } from 'src/app/shared/services/user.service';
import { RoleService } from 'src/app/shared/services/role.service';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.scss']
})
export class AdminUsersListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  uSub$: Subscription;
  isLoading = true;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {

    this.uSub$ = this.userService.getUsers()
      .subscribe(data => {
        this.users = data.users;
        this.users.forEach(user => {
          user.role = data.roles.filter(role => role._id === user.role)[0].name;
        });
        this.isLoading = false;
      }, err => console.log(err));

  }

  ngOnDestroy(): void {
    if (this.uSub$) {
      this.uSub$.unsubscribe();
    }
  }

}
