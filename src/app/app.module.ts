import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserService } from './user.service';
import { DashboardService } from './dashboard.service';
import { AuthguardGuard } from './authguard.guard';
import { MyorderComponent } from './myorder/myorder.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginFormComponent,
    DashboardComponent,
    MyorderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	FormsModule,
	HttpClientModule
  ],
  providers: [UserService,DashboardService,AuthguardGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
	showHeader = true;
}
