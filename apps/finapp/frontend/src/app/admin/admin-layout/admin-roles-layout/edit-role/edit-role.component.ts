import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { RoleService } from 'src/app/shared/services/role.service';
import { Role } from 'src/app/shared/interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit, OnDestroy {

  role: Role;
  form: FormGroup;
  rSub$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      code_name: new FormControl(null, Validators.required),
      desc: new FormControl(null)
    });

    this.form.disable();

    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['id']) {
          return this.roleService.getRoleById(params['id']);
        }
        return of(null);
      })
    ).subscribe((role: Role) => {
      if (role) {
        this.role = role;
        this.form.patchValue({
          name: role.name,
          code_name: role.code_name,
          desc: role.desc
        });
      }
      this.form.enable();
    }, err => console.log(err));

  }

  ngOnDestroy(): void {
    if (this.rSub$) {
      this.rSub$.unsubscribe();
    }
  }

  submit(): void {
    this.form.disable();
    if (!this.form.invalid) {
      this.roleService.update(this.role._id, this.form.value)
        .subscribe(role => {
          console.log('Role was updated', role);
          this.role = role;
          this.form.enable();
        });
    }
  }

  remove(): void {
    this.rSub$ = this.roleService.delete(this.role)
      .subscribe(() => {
        this.router.navigate(['/admin', 'roles']);
      });
  }
}
