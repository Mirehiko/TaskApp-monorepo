import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, Validators.required)
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  submit(): void {
    if ( !this.form.invalid ) {
      this.form.disable();
      const user = this.form.value;
      this.aSub = this.authService.register(user)
        .subscribe(() => {
          this.router.navigate(['/cabinet']);
        },
        err => {
          console.log('ERROR');
          console.log(err);
          this.form.enable();
        });
    }
  }

}
