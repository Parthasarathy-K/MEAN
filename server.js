var express = require("express");
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
const mysql = require('mysql');
var Promise = require('promise');
var str2json = require('string-to-json');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "emart",
  port:3306
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

app.listen(8080,function(){
  console.log("Started on PORT 8080");
})
///calc/:oper/:operand1/:operand2
app.post('/authenticate', function(req,res){
	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "emart",
	  port:3306
	});
	var promise = validateUser(req.body);
	promise.then(function(response){
		console.log("result ",response);
		//res.type('json');
		res.json(response);
	});
});

app.get('/getItems', function(req,res){
	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "emart",
	  port:3306
	});
	var promise = getItems();
	promise.then(function(response){
		res.json(response);
	});
});

app.post('/getMyOrders', function(req,res){
	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "emart",
	  port:3306
	});
	var promise = getMyOrders(req.body);
	promise.then(function(response){
		//console.log("result ",response);
		res.json(response);
	});
});
app.post('/placeOrder', function(req,res){
	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "emart",
	  port:3306
	});
	var promise = placeOrder(req.body);
	promise.then(function(response){
		//console.log("result ",response);
		res.json(response);
	});
});

app.post('/cancelOrder', function(req,res){
	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "emart",
	  port:3306
	});
	var promise = cancelOrder(req.body);
	promise.then(function(response){
		//console.log("result ",response);
		res.json(response);
	});
});

app.post('/modifyOrder', function(req,res){
	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "emart",
	  port:3306
	});
	var promise = modifyOrder(req.body);
	promise.then(function(response){
		//console.log("result ",response);
		res.json(response);
	});
});

function validateUser(request){
	return new Promise(function(resolve, reject) {
		var sql = "select * from emart_user where username='"+request.uname+"' and password='"+request.pwd+"'";	
		con.query(sql, function (err, result, fields) {
			if (err) {
				resolve({"isAuthorised":false});
			}
			if(result.length==1){
				var response = {
					"isAuthorised":true,
					"uname":result[0].username,
					"email":result[0].email
				};
				resolve(response);
			}else{
				resolve({"isAuthorised":false});
			}
			con.end();
		});
	});
}

function getItems(){
	return new Promise(function(resolve, reject) {
		var sql = "select * from emart_items order by item_id";
		con.query(sql, function (err, result, fields) {
			if (err) {
				resolve({"itemList":[]});
			}else{
				resolve({"itemList":result});
			}
		});
	});
}

function getMyOrders(request){
	return new Promise(function(resolve, reject) {
		var sql = "select ord.order_id,ord.username,ord.bill_amt,ord.order_status,itm.item_id,orditm.ord_cnt,itm.item_name,itm.price from emart_orders ord,emart_ord_items orditm,emart_items itm where ord.username='"+request.uname + "' and ord.order_id = orditm.order_id and orditm.item_id = itm.item_id order by ord.order_id;";	
		console.log("query ",sql);
		con.query(sql, function (err, result, fields) {
			if (err) {
				resolve({"errText":"Error while getting orders"});
			}
			console.log("result ",result);
			resolve({"orderDetails":result});
		});
	});
}


function placeOrder(request){
	return new Promise(function(resolve, reject) {
		var sql = "select max(order_id)+1 ordId from emart_orders";
		var maxOrdId = 0;
		var billAmt = 0;
		for(var index=0;index<request.itemList.length;index++){
			console.log("item ",request.itemList[index].price,request.itemList[index].ord_cnt);
			billAmt = billAmt+(request.itemList[index].price*request.itemList[index].ord_cnt);
		}
		
		con.query(sql, function (err, result, fields) {
			if (err) {
				resolve({"errText":"Error while getting Order Id"});
			}
			maxOrdId = result[0].ordId;
			sql = "insert into emart_orders values("+maxOrdId+",'"+request.user.uname+"',"+billAmt+",'New')";
			con.query(sql, function (err, result, fields) {
				if (err) {
					console.log("error ",err);
					resolve({"errText":"Error while creating order"});
				}
				var i=1;
				for(var index=0;index<request.itemList.length;index++){
					sql = "insert into emart_ord_items values("+maxOrdId+","+request.itemList[index].item_id+","+request.itemList[index].ord_cnt+")";
					con.query(sql, function (err, result, fields) {
						if (err) {
							console.log("error1 ",err);
							resolve({"errText":"Error while creating itemlist"});
						}
						if(i==request.itemList.length){
							resolve({"order_id":maxOrdId});
						}
						i++;
					});
				}
			});
		});
	});
}

function cancelOrder(request){
	return new Promise(function(resolve, reject) {
		var sql = "update emart_orders set order_status='Cancelled' where order_id="+request.orderId;
		con.query(sql, function (err, result, fields) {
			if (err) {
				console.log("error ",err);
				resolve({"errText":"Error while cancelling order"});
			}
			resolve({"status":"Order Cancelled Successfully"});
		});
	});
}

function modifyOrder(request){
	return new Promise(function(resolve, reject) {
		var billAmt = 0;
		for(var index=0;index<request.itemList.length;index++){
			console.log("item ",request.itemList[index].price,request.itemList[index].ord_cnt);
			billAmt = billAmt+(request.itemList[index].price*request.itemList[index].ord_cnt);
		}
		sql = "update emart_orders set bill_amt="+billAmt+" where order_id="+request.itemList[0].order_id;
		con.query(sql, function (err, result, fields) {
			if (err) {
				console.log("error ",err);
				resolve({"errText":"Error while updating order"});
			}
			var i=1;
			for(var index=0;index<request.itemList.length;index++){
				sql = "update emart_ord_items set ord_cnt="+request.itemList[index].ord_cnt+" where order_id="+request.itemList[0].order_id+" and item_id="+request.itemList[0].item_id;
				con.query(sql, function (err, result, fields) {
					if (err) {
						console.log("error ",err);
						resolve({"errText":"Error while updating items"});
					}
					if(i==request.itemList.length){
						resolve({"status":"Order updated Successfully."});
					}
					i++;
				});
			}
		});
	});
}