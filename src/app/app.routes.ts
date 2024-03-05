import { Routes } from '@angular/router';
import { LoginModule } from './login/login.module';

export const routes: Routes = [
  { path: '' ,redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => LoginModule }
];
