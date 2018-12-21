import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css']
})
export class MyorderComponent implements OnInit {

	constructor(private dashboard:DashboardService) {}
	orderDetails = {};
	keys = [];
	cancelOrderId = '';
	ngOnInit() {
		this.getOrders();
	}
	
	getOrders(){
		let that = this;
		this.dashboard.getMyOrders().then(function(response){
			that.orderDetails = {};
			response.orderDetails.forEach(item =>{
				item.modifyOrder = true;
				item.newBillAmt = 0;
				if(that.orderDetails[item.order_id]==undefined){
					that.orderDetails[item.order_id] = [];
					that.orderDetails[item.order_id].push(item)
				}else{
					that.orderDetails[item.order_id].push(item);
				}
			});
			console.log(that.orderDetails);
			that.generateKeys(that.orderDetails);
		});
	}
	generateKeys(obj) {
		this.keys = Object.keys(obj);
	}
	
	getItems(itemList, key: string) {
		console.log(key, itemList[key]);
		return key ? itemList[key] : null;
	}
	
	
	calculateNewBillAmt(orderId){
		var temp = 0;
		this.orderDetails[orderId].forEach(item =>{
			console.log("item ",item);
			temp = temp+(item.price * item.ord_cnt);
		});
		this.orderDetails[orderId][0].newBillAmt=temp;
	}
	
	modifyOrder(order){
		let that = this;
		var request = {
			"itemList":order
		};
		this.dashboard.modifyOrder(request).then(function(response){
			alert(response.status);
			that.getOrders();
		});
	}
	
	cancelOrder(){
		let that = this;
		this.dashboard.cancelOrder({"orderId":this.cancelOrderId}).then(function(response){
			alert(response.status);
			that.getOrders();
		});
	}
}