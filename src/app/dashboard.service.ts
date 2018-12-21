import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import {Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import { UserService } from './user.service';

@Injectable()
export class DashboardService {

	constructor(private http: HttpClient,private user:UserService) {
		
	}

	getItems(): Promise<any>{
      return this.http.get("http://localhost:8080/getItems")
                 .toPromise()
                 .then(this.handleData);
                 //.catch(this.handleError)
	}
	getMyOrders(): Promise<any>{
		
		return this.http.post("http://localhost:8080/getMyOrders",this.user.getUserDetails())
                 .toPromise()
                 .then(this.handleData);
	}
	placeOrder(request): Promise<any>{
		return this.http.post("http://localhost:8080/placeOrder",request)
                 .toPromise()
                 .then(this.handleData);
	}
	
	modifyOrder(request): Promise<any>{
		return this.http.post("http://localhost:8080/modifyOrder",request)
                 .toPromise()
                 .then(this.handleData);
	}
	
	cancelOrder(request): Promise<any>{
		return this.http.post("http://localhost:8080/cancelOrder",request)
                 .toPromise()
                 .then(this.handleData);
	}
	private handleData(res: any):Promise<any> {
		//console.log(res);
		return Promise.resolve(res);
	}
	
	private handleError(error: any): Promise<any> {
		return Promise.resolve(null);
	}
	
	
}
