import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';

@Injectable()
export class AuthguardGuard implements CanActivate {
	constructor(private router:Router,private user:UserService) {
		
	}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		var result = this.user.getUserLoggedIn();
		
		if(result){
			return true;
		}
		this.router.navigate([''], { queryParams: { returnUrl: state.url }});
		return false;
  }
}
