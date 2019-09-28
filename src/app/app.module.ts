import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { OkrComponent } from './okr/okr.component';
import { NewOkrComponent } from './okr/new-okr/new-okr.component';
import { EditOkrComponent } from './okr/edit-okr/edit-okr.component';
import { UsersComponent } from './users/users.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { ResetpasswordComponent } from './login/resetpassword/resetpassword.component';
import { NewPasswordComponent } from './login/new-password/new-password.component';
import { OkrmapComponent } from './okrmap/okrmap.component';
import { NodeVisualComponent } from './okrmap/node-visual/node-visual.component';
import { LinkVisualComponent } from './okrmap/link-visual/link-visual.component';
import { GraphComponent } from './okrmap/graph/graph.component';
import { D3_DIRECTIVES} from './d3';
import { D3Service} from './d3/d3.service';
import {SHARED_VISUALS} from './okrmap/index';
import { OkrTreeComponent } from './okr-tree/okr-tree.component';
import { NodeComponent } from './okr-tree/node/node.component';
import { EdgeComponent } from './okr-tree/edge/edge.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    CompanyComponent,
    OkrComponent,
    NewOkrComponent,
    EditOkrComponent,
    UsersComponent,
    NewUserComponent,
    ResetpasswordComponent,
    NewPasswordComponent,
    OkrmapComponent,
    NodeVisualComponent,
    LinkVisualComponent,
    GraphComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    OkrTreeComponent,
    NodeComponent,
    EdgeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthenticationService, AuthGuardService, D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
