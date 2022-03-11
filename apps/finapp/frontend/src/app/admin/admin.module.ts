import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './admin-layout/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminRolesLayoutComponent } from './admin-layout/admin-roles-layout/admin-roles-layout.component';
import { AdminRolesListComponent } from './admin-layout/admin-roles-layout/admin-roles-list/admin-roles-list.component';
import { CreateRoleComponent } from './admin-layout/admin-roles-layout/create-role/create-role.component';
import { EditRoleComponent } from './admin-layout/admin-roles-layout/edit-role/edit-role.component';
import { AdminUsersLayoutComponent } from './admin-layout/admin-users-layout/admin-users-layout.component';
import { AdminUsersListComponent } from './admin-layout/admin-users-layout/admin-users-list/admin-users-list.component';
import { CreateUserComponent } from './admin-layout/admin-users-layout/create-user/create-user.component';
import { EditUserComponent } from './admin-layout/admin-users-layout/edit-user/edit-user.component';
import { AuthGuard } from '../shared/classes/auth.guard';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { AdminCategoriesComponent } from './admin-layout/admin-categories/admin-categories.component';
import { FormCategoryComponent } from './admin-layout/admin-categories/form-category/form-category.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      {
        path: 'roles',
        component: AdminRolesLayoutComponent,
        children: [
          { path: '', component: AdminRolesListComponent, pathMatch: 'full', },
          { path: 'new', component: CreateRoleComponent },
          { path: ':id', component: EditRoleComponent },
        ],
      },

      {
        path: 'users',
        component: AdminUsersLayoutComponent,
        children: [
          { path: '', component: AdminUsersListComponent, pathMatch: 'full', },
          { path: 'new', component: CreateUserComponent },
          { path: ':id', component: EditUserComponent },
        ],
      },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'categories/new', component: FormCategoryComponent },
      { path: 'categories/:id', component: FormCategoryComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AdminLayoutComponent,
    CreateUserComponent,
    EditUserComponent,
    CreateRoleComponent,
    EditRoleComponent,
    AdminDashboardComponent,
    AdminRolesLayoutComponent,
    AdminUsersLayoutComponent,
    AdminUsersListComponent,
    AdminRolesListComponent,
    PreloaderComponent,
    AdminCategoriesComponent,
    FormCategoryComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    RouterModule,
    AdminLayoutComponent,
    CreateUserComponent,
    EditUserComponent,
    CreateRoleComponent,
    EditRoleComponent,
    AdminDashboardComponent,
    AdminRolesLayoutComponent,
    AdminUsersLayoutComponent,
    AdminUsersListComponent,
    AdminRolesListComponent,
  ],
})
export class AdminModule {}
