import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from './auth.component';
import { LoginPageComponent } from './login-page/login-page.component';


const routes: Routes = [
  {
    path: "login",
    component: LoginPageComponent,
  },
  {
    path: "registration",
    component: LoginPageComponent,
    // data: {
    //   registration: true
    // }
  },
  {
    path: "restore",
    component: LoginPageComponent,
    // data: {
    //   restore: true
    // }
  },
  {
    path: "confirm",
    component: LoginPageComponent,
    // data: {
    //   confirm: true
    // }
  },
  {
    path: "",
    component: AuthComponent,
    redirectTo: 'login'
  },
  {
    path: "**",
    redirectTo: "login"
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: []
})
export class AuthRoutingModule {
}
