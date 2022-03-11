import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';


const routes: Routes = [
  {path: '', component: AuthLayoutComponent, children: [
    {path: '', component: LandingComponent, pathMatch: 'full'},
    {path: 'login', component: LoginPageComponent},
    {path: 'register', component: RegisterPageComponent}
  ]},
  // {path: 'error', component: ErrorPageComponent},
  // {path: '**', redirectTo: '/error'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
