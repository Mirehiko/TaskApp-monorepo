import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User, Role } from 'src/app/shared/interfaces';
import { UserRestService } from 'src/app/shared/services/user.service';
import { RoleService } from 'src/app/shared/services/role.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  user: User;
  roles: Role[] = [];
  form: FormGroup;
  uSub$: Subscription;
  rSub$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserRestService,
    private roleService: RoleService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      name: new FormControl(null),
      role: new FormControl(null),
      avatar: new FormControl(null)
    });

    this.form.disable();

    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params.id) {
          return this.userService.getUserById(params.id);
        }
        return of(null);
      })
    ).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.form.patchValue({
          email: user.email,
          password: user.password,
          name: user.name,
          avatar: user.avatar,
          role: user.role
        });
      }
      this.form.enable();
    }, err => console.log(err));

    this.rSub$ = this.roleService.fetch().subscribe(
      roles => {
        this.roles = roles;
        this.form.patchValue({
          role: roles.filter(role => role._id === this.user.role)[0]._id
        });
      },
      err => console.log(err)
    );
  }

  ngOnDestroy(): void {
    if (this.uSub$) {
      this.uSub$.unsubscribe();
    }
    if (this.rSub$) {
      this.rSub$.unsubscribe();
    }
  }

  submit(): void {
    this.form.disable();
    if (!this.form.invalid) {
      this.userService.update(this.user._id, this.form.value)
        .subscribe(user => {
          console.log('User was updated', user);
          this.user = user;
          this.form.enable();
        });
    }
  }

  remove(): void {
    this.uSub$ = this.userService.delete(this.user._id)
      .subscribe(() => {
        this.router.navigate(['/admin', 'users']);
      });
  }
}
