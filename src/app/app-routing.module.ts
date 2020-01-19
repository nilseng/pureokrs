import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AuthGuardService } from './auth-guard.service';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {OkrListComponent} from './okr-list/okr-list.component';
import { UsersComponent } from './users/users.component';
import {ResetpasswordComponent} from './login/resetpassword/resetpassword.component';
import { NewPasswordComponent } from './login/new-password/new-password.component';
import { OkrTreeComponent } from './okr-tree/okr-tree.component';
import { FaqComponent } from './faq/faq.component';
import { OkrResolver} from './okr/okr-resolver.service';
import { UsersResolver } from './users/users-resolver.service';
import { OkrTreeService } from './okr-tree.service';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: OkrListComponent, canActivate: [AuthGuardService], resolve: {okrs: OkrResolver}},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'okr-tree', component: OkrTreeComponent, canActivate: [AuthGuardService], resolve: {okrs: OkrResolver}},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuardService], resolve: {users: UsersResolver}},
  {path: 'resetpassword', component: ResetpasswordComponent},
  {path: 'resetpassword/:email/:token', component: NewPasswordComponent},
  {path: 'faq', component: FaqComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
