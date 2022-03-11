import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/app/shared/services/role.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {

  form: FormGroup;

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      code_name: new FormControl(null, Validators.required),
      desc: new FormControl(null)
    });
  }

  submit(): void {
    this.form.disable();
    if (!this.form.invalid) {
      const tmpRole = this.form.value;
      this.roleService.create(tmpRole)
        .subscribe(role => {
          console.log('Role was created', role);
          this.form.patchValue({
            name: '',
            code_name: '',
            desc: '',
          });
          this.form.enable();
        });
    }
  }
}
