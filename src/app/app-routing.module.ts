import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AuthGuardService } from './auth-guard.service';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {CompanyComponent} from './company/company.component';
import {EditOkrComponent} from './okr/edit-okr/edit-okr.component';
import {NewOkrComponent} from './okr/new-okr/new-okr.component';
import { UsersComponent } from './users/users.component';
import {ResetpasswordComponent} from './login/resetpassword/resetpassword.component';
import { NewPasswordComponent } from './login/new-password/new-password.component';
import { OkrTreeComponent } from './okr-tree/okr-tree.component';

const routes: Routes = [
  {path: '', redirectTo: '/company/okrs', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'company/okrs', component: CompanyComponent, canActivate: [AuthGuardService]},
  {path: 'okr-tree', component: OkrTreeComponent, canActivate: [AuthGuardService]},
  {path: 'edit-okr/:id', component: EditOkrComponent, canActivate: [AuthGuardService]},
  {path: 'new-okr/:parent', component: NewOkrComponent, canActivate: [AuthGuardService]},
  {path: 'company/users', component: UsersComponent, canActivate: [AuthGuardService]},
  {path: 'resetpassword', component: ResetpasswordComponent},
  {path: 'resetpassword/:email/:token', component: NewPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
