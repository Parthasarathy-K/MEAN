import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import {Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';

export interface AuthProperty {
  // Properties
}

@Injectable()
export class UserService {
	
	private isUserLoggedIn;
	private userDetails;
	private headers;
	constructor(private http: HttpClient) { 
		this.isUserLoggedIn = false;
		this.headers = new Headers({
            'Content-Type': 'application/text',
			'Access-Control-Max-Age': 86400
        });
	}
	
	setUserLoggedIn(){
		this.isUserLoggedIn = true;
	}
	
	getUserLoggedIn(){
		return this.isUserLoggedIn;
	}
	setUserDetails(user){
		this.userDetails = user;
	}
	getUserDetails(){
		return this.userDetails;
	}
	logout(){
		this.isUserLoggedIn = false;
	}
	
	authenticateUser(uname:string,pwd:string): Promise<any>{
		var request = {
			uname:uname,
			pwd:pwd
		};
      return this.http.post("http://localhost:8080/authenticate",request)
                 .toPromise()
                 .then(this.handleData);
                 //.catch(this.handleError)
	}
	private handleData(res: any):Promise<any> {
		//let body = res.json();
		console.log(res); // for development purposes only
		return Promise.resolve(res);
	}
	
	private handleError(error: any): Promise<any> {
		//console
		return Promise.resolve(null);
	}
}
