import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthGuard } from '../shared/classes/auth.guard';

import { CabinetLayoutComponent } from '../shared/layouts/cabinet-layout/cabinet-layout.component';
import { PreloaderComponent } from '../shared/components/preloader/preloader.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';

import { BillsComponent } from './bills/bills.component';
import { BillFormComponent } from './bills/bill-form/bill-form.component';
import { BillListComponent } from './bills/bill-list/bill-list.component';

import { CardsComponent } from './cards/cards.component';
import { ListCardComponent } from './cards/list-card/list-card.component';
import { FormCardComponent } from './cards/form-card/form-card.component';

import { TargetPageComponent } from './target-page/target-page.component';
import { FormTargetComponent } from './target-page/form-target/form-target.component';
import { ListTargetComponent } from './target-page/list-target/list-target.component';

import { OperationsPageComponent } from './operations-page/operations-page.component';
import { OperationListComponent } from './operations-page/operation-list/operation-list.component';
import { FormOperationComponent } from './operations-page/form-operation/form-operation.component';

const routes: Routes = [
  {
    path: 'cabinet',
    component: CabinetLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'bills', component: BillsComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: BillListComponent },
        { path: 'new', component: BillFormComponent },
        { path: ':id', component: BillFormComponent },
      ] },
      { path: 'cards', component: CardsComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: ListCardComponent },
        { path: 'new', component: FormCardComponent },
        { path: ':id', component: FormCardComponent },
      ] },
      { path: 'targets', component: TargetPageComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: ListTargetComponent },
        { path: 'new', component: FormTargetComponent },
        { path: ':id', component: FormTargetComponent },
      ] },
      { path: 'profile', component: ProfileComponent },
      { path: 'analytics', component: AnalyticsPageComponent },
      { path: 'operations', component: OperationsPageComponent },
    ],
  },
];

@NgModule({
  declarations: [
    CabinetLayoutComponent,
    DashboardComponent,
    ProfileComponent,
    BillsComponent,
    BillFormComponent,
    BillListComponent,
    OperationsPageComponent,
    AnalyticsPageComponent,
    PreloaderComponent,
    OperationListComponent,
    ListCardComponent,
    FormCardComponent,
    CardsComponent,
    TargetPageComponent,
    FormTargetComponent,
    ListTargetComponent,
    FormOperationComponent
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
  ],
})
export class CabinetModule {}
