import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestResultComponent } from './request-result/request-result.component';

const routes: Routes = [
  {
    path: 'panel',
    component: UserComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
  {
    path: 'request',
    component: UserComponent,
    children: [
      {
        path: '',
        component: RequestResultComponent,
      },
    ],
  },
  {
    path: '',
    component: LoginComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
