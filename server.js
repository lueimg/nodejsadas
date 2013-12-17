var express = require("express"),
	swig = require("swig");
var server = express();

//CONFIGURAR EL MOTOR DE TEMPLATE
server.engine("html",swig.renderFile);
server.set("view engine","html");
server.set("views","./app/views");


server.get("/",function(req,res){
	//res.send("hola");
	res.render("home");
});


server.listen(3000);