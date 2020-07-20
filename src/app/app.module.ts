import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { OkrListComponent } from './okr-list/okr-list.component';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { OkrNodeComponent } from './okr-list/okr-node/okr-node.component';
import { NewOkrComponent } from './okr/new-okr/new-okr.component';
import { EditOkrComponent } from './okr/edit-okr/edit-okr.component';
import { UsersComponent } from './users/users.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { ResetpasswordComponent } from './login/resetpassword/resetpassword.component';
import { NewPasswordComponent } from './login/new-password/new-password.component';
import { D3_DIRECTIVES } from './d3';
import { D3Service } from './d3/d3.service';
import { OkrTreeComponent } from './okr-tree/okr-tree.component';
import { NodeComponent } from './okr-tree/node/node.component';
import { EdgeComponent } from './okr-tree/edge/edge.component';
import { AboutComponent } from './about/about.component';
import { FontAwesomeModule } from 'node_modules/@fortawesome/angular-fontawesome';
import { OkrService } from './okr.service';
import { OkrResolver } from './okr/okr-resolver.service';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UsersResolver } from './users/users-resolver.service';
import { PrivacyComponent } from './privacy/privacy.component';
import { IeNotSupportedComponent } from './error-pages/ie-not-supported.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    OkrListComponent,
    OkrNodeComponent,
    NewOkrComponent,
    EditOkrComponent,
    UsersComponent,
    NewUserComponent,
    ResetpasswordComponent,
    NewPasswordComponent,
    ...D3_DIRECTIVES,
    OkrTreeComponent,
    NodeComponent,
    EdgeComponent,
    AboutComponent,
    FooterComponent,
    NavbarComponent,
    PrivacyComponent,
    IeNotSupportedComponent
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    D3Service,
    OkrService,
    OkrResolver,
    UsersResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
