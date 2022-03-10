import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces';
import { UserRestService } from 'src/app/shared/services/user.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { UserResponseDto } from '../../../../../../../backend/src/app/modules/common/user/dto/user-response.dto';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.scss']
})
export class AdminUsersListComponent implements OnInit, OnDestroy {

  users: UserResponseDto[] = [];
  uSub$: Subscription;
  isLoading = true;

  constructor(
    private userService: UserRestService,
  ) { }

  ngOnInit(): void {

    this.uSub$ = this.userService.getAll()
      .subscribe(users => {
        this.users = users;
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
