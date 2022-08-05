import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';


@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    RouterModule,
  ],
})
export class AdminModule {
}
