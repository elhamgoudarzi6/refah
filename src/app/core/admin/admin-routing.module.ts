import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministratorsComponent } from './administrators/administrators.component';
import { EmployeeComponent } from './employee/employee.component';
import { LotteryComponent } from './lottery/lottery.component';
import { RequestComponent } from './request/request.component';
import { LoanComponent } from './loan/loan.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'panel',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },

  {
    path: 'employee',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: EmployeeComponent,
      },
    ],
  },
  {
    path: 'loan',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: LoanComponent,
      },
    ],
  },
  {
    path: 'request',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: RequestComponent,
      },
    ],
  },
  {
    path: 'lottery',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: LotteryComponent,
      },
    ],
  },
  {
    path: 'config',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: AdministratorsComponent,
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
