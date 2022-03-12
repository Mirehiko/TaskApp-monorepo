import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoleService } from '../../../../shared/services/role.service';
import { Role } from '../../../../shared/interfaces';


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
