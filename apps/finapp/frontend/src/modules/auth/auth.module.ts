import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthComponent } from './auth.component';
import { MainRoutingModule } from '../main/main-routing.module';


@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    MainRoutingModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    RouterModule,
  ],
})
export class AuthModule {
}
