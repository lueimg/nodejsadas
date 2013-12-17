var express = require("express");
var server = express();

//valores en el servidor
var messages = [];
var responses = []

server.get("/",function (req, res){
	
	//res.send es el momento en el que quiera mandarle algo al usuario
	res.send("hola mundo");
});


server.get("/messages/:message",function (req, res){
	
	messages.push(req.params.message);

	responses.forEach(function(res){
		var script = "<script>window.location.reload();</script>"
		res.send(messages + script);
	});



	res.send("tu mensaje es " + req.params.message);
});


server.get("/messages",function(req,res){

	responses.push(res);

});


server.listen(3000);