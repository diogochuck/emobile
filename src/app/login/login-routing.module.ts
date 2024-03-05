import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImeiIdComponent } from './imei-id/imei-id.component';
import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'imei', pathMatch: 'full'
  },
  {
    path: 'imei', component: ImeiIdComponent
  },
  {
    path: 'login', component: LoginFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutinglModule { }
