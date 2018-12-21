import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyorderComponent } from './myorder/myorder.component';
import { AuthguardGuard } from './authguard.guard';

const routes: Routes = [
	{
		path:'',
		component:LoginFormComponent
	},
	{
		path:'dashboard',
		component:DashboardComponent,
		canActivate:[AuthguardGuard]
	},
	{
		path:'myorder',
		component:MyorderComponent,
		canActivate:[AuthguardGuard]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
