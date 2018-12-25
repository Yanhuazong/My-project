import { CommitteeService } from './service/committee.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { DataService } from './service/data.service';
import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin/admin.component';
import { AdminUserComponent } from './admin/admin-user/admin-user.component';
import { AdminRubricComponent } from './admin/admin-rubric/admin-rubric.component';
import { StudentComponent } from './student/student.component';
import { CommitteeComponent } from './committee/committee.component';
import { CommitteeEvaComponent } from './committee-eva/committee-eva.component';
import { AuthGuardService } from 'src/app/service/auth-guard.service';
import { SortPipe } from './service/sort.pipe';
import { HeadComponent } from './head/head.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AuthguardUpdateUserService } from './service/authguard-update-user.service';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService],data:{permission:{only:['user','admin'], redirectTo: 'login'}},children:[
    { path: '', redirectTo: 'adminuser', pathMatch: 'full' },
    { path: 'adminuser', component: AdminUserComponent},
    { path: 'adminrubric', component: AdminRubricComponent}
  ]},
  { path: 'student', component: StudentComponent, canActivate: [AuthGuardService],data:{permission:{only:['user','student'], redirectTo: 'login'}}},
  { path: 'committee', component: CommitteeComponent, canActivate: [AuthGuardService],data:{permission:{only:['user','faculty'], redirectTo: 'login'}}},
  { path: 'committee/:id', component: CommitteeEvaComponent, canActivate: [AuthGuardService],data:{permission:{only:['user','faculty'], redirectTo: 'login'}}},
  { path: 'head', component: HeadComponent, canActivate: [AuthGuardService],data:{permission:{only:['user','departmentHead'], redirectTo: 'login'}}},
  { path: 'super-admin', component: SuperAdminComponent, canActivate: [AuthGuardService],data:{permission:{only:['user','superAdmin'], redirectTo: 'login'}}},
  { path: 'update', component: UpdateUserComponent, canActivate: [AuthguardUpdateUserService]}
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    AdminComponent,
    AdminUserComponent,
    AdminRubricComponent,
    StudentComponent,
    CommitteeComponent,
    CommitteeEvaComponent,
    SortPipe,
    HeadComponent,
    SuperAdminComponent,
    UpdateUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [DataService,AuthGuardService,HttpErrorHandler, MessageService,AuthguardUpdateUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
