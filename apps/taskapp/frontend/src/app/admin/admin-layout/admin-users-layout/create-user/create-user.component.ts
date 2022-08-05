import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Role } from '../../../../shared/interfaces';
import { UserRestService } from '../../../../shared/services/user.service';
import { RoleService } from '../../../../shared/services/role.service';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {

  form: FormGroup;
  roles: Role[] = [];
  rSub$: Subscription;

  constructor(
    private userService: UserRestService,
    private roleService: RoleService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, Validators.required),
      name: new FormControl(null),
      role: new FormControl(null),
      avatar: new FormControl(null)
    });

    this.rSub$ = this.roleService.fetch().subscribe(
      roles => {
        this.roles = roles;
        this.form.patchValue({
          role: this.roles.filter(role => role.code_name === 'default')[0]._id
        });
      },
      err => console.log(err)
    );
  }

  ngOnDestroy(): void {
    if (this.rSub$) {
      this.rSub$.unsubscribe();
    }
  }

  submit(): void {
    this.form.disable();
    if (!this.form.invalid) {
      this.userService.create(this.form.value)
        .subscribe(user => {
          console.log('User was created', user);
          this.form.patchValue({
            name: '',
            email: '',
            password: '',
            avatar: '',
            role: this.roles.filter(role => role.code_name === 'default')[0]._id
          });
          this.form.enable();
        });
    }
  }
}
