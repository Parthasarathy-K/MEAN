import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

	constructor(private router:Router,private user:UserService) {
		
	}
	@Input() uname='';
	@Input() pwd='';
	ngOnInit() {
	}
	errText = '';
	loginUser(e){
		if(this.uname=='' || this.pwd=='')return false;
		this.errText = '';
		let that = this;
		this.user.authenticateUser(this.uname,this.pwd).then(function(response){
			if(response!=null && response.isAuthorised){
				that.user.setUserLoggedIn();
				that.user.setUserDetails(response);
				that.router.navigate(['/dashboard']);
			}else{
				that.errText = 'Invalid user name or password.'
			}
		});
	}
	
}
