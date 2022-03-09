import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/shared/interfaces';
import { RoleService } from 'src/app/shared/services/role.service';

@Component({
  selector: 'app-admin-roles-list',
  templateUrl: './admin-roles-list.component.html',
  styleUrls: ['./admin-roles-list.component.scss']
})
export class AdminRolesListComponent implements OnInit, OnDestroy {

  roles: Role[] = [];
  rSub: Subscription;

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.rSub = this.roleService.fetch()
      .subscribe(roles => {
        this.roles = roles;
      }, err => console.log(err));
  }

  ngOnDestroy(): void {
    if (this.rSub) {
      this.rSub.unsubscribe();
    }
  }
}
