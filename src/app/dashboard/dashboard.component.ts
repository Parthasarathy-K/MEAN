import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { UserService } from '../user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	constructor(private dashboard:DashboardService,private user:UserService) {
		
	}
	itemList = [];
	itemAdded = false;
	selectedItem = [];
	ngOnInit() {
		let that = this;
		this.dashboard.getItems().then(function(response){
			that.itemList = response.itemList;
		});
	}
	addToCart(item){
		item.ord_cnt = 1;
		item.added = true;
	}
	removeFromCart(item){
		item.added = false;
		item.ord_cnt = 0;
	}
	getSelectedItem(){
		this.itemAdded = false;
		this.selectedItem = [];
		this.itemList.forEach(item =>{
			console.log("item ",item);
			if(item.added == true){
				this.itemAdded = true;
				this.selectedItem.push(item);
			}
		});
	}
	placeOrder(){
		if(!this.itemAdded){
			alert("Add atleast one item.");
		}else{
			var request = {
				itemList:this.selectedItem,
				user:this.user.getUserDetails()
			};
			this.dashboard.placeOrder(request).then(function(response){
				console.log("response",response);
				if(response.order_id!=undefined){
					alert("Order placed Successfully. Order Id is "+response.order_id+".");
				}
			});
		}
	}
}
