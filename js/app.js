/*
*Self executing Functions 
*/
var db_name = "https://resplendent-fire-9817.firebaseio.com/users";
var data_db = "https://repldb.firebaseio.com/";
var device_name = "dev1";



var setUsername = function(username){
	document.getElementById('user_name').innerHTML = username;
}
var getusername = function(){
	var location_temp = window.location.hash;
	var username = "";
	try{
		username = location_temp.split("&")[0];
		username = username.slice(1,username.length);
	}
	catch(err){
		console.log(err);
		username = "unidentfied user";
		setUsername(username);
		return username;
	}
	setUsername(username);
	loaddata();
	loaddatavoltage();
	return username;
};

var loaddata = function(){
	var dbref = new Firebase(data_db+device_name);
	var rows = [];
	dbref.limitToLast(1000).on("value", function(snapshot) {
		var i=0;
		snapshot.forEach(function(data) {
			var interm_row = [data.val().time_stamp,data.val().current];
			rows.push(interm_row);
			i++;
		});
		document.getElementById("line_chart_current").setAttribute("rows",JSON.stringify(rows));
	});
	dbref.on('child_added', function(childSnapshot, prevChildKey) {
	});
}
var loaddatavoltage = function(){
	var dbref = new Firebase(data_db+device_name);
	var rows = [];
	dbref.limitToLast(1000).on("value", function(snapshot) {
		var i=0;
		snapshot.forEach(function(data) {
			var interm_row = [data.val().time_stamp,data.val().voltage];
			rows.push(interm_row);
			i++;
		});
		document.getElementById("line_chart_voltage").setAttribute("rows",JSON.stringify(rows));
	});
	dbref.on('child_added', function(childSnapshot, prevChildKey) {
		
	})
}
var signup = function(){
	var new_user = new Firebase(db_name);
	new_user.once("value",function(snapshot){
		var email = document.getElementById("s_username").value;
		var password =document.getElementById("s_password").value;
		var format_email = email.replace(/\./g,"*");
		var user_name = snapshot.child(format_email).exists();
		if(!user_name){
			new_user.createUser({
				email:email,
				password:password
			},function(error,userData){
				if(error){
					console.log("error while creating the user",error);
				}
				else{
					document.getElementById("hiddenlabel").innerHTML="";
					new_user.update({[format_email]:password});
					document.getElementById("s_username").innerHTML="";
					document.getElementById("s_password").innerHTML="";
					document.getElementById("hiddenlabel").innerHTML="Thanks for Signin up";
					document.getElementById("sign_up").remove();
				}
			});
		}
		else{
			document.getElementById("hiddenlabel").innerHTML="";
			document.getElementById("hiddenlabel").innerHTML="User Already Registered Please try other Username!";
		}
	});
	
	return false;
}

var loginup = function(){
	var ex_user = new Firebase(db_name);
	var email = document.getElementById("l_username").value;
	var password =document.getElementById("l_password").value;
	ex_user.authWithPassword({
		email:email,
		password:password
	},function(error,authData){
		if(error){
			console.log("Login Failed!", error);
		}
		else{
			console.log("Authenticated successfully with payload:", authData);
			window.location.href = "index.html"+"#"+email+"&"+authData.uid;
		}
	});
	
	return false;
}
