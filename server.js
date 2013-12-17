var express = require("express"),
	swig = require("swig");
var server = express();

var RedisStore = require("connect-redis")(express);

//CONFIGURAR EL MOTOR DE TEMPLATE
server.engine("html",swig.renderFile);
server.set("view engine","html");
server.set("views","./app/views");

server.configure(function(){
	server.use(express.logger());
	server.use(express.cookieParser());
	server.use(express.bodyParser());


	server.use(express.session({
		secret: "kdshfskdjf",
		store: new RedisStore({})
	}));


});



server.get("/",function(req,res){
	//res.send("hola");
	res.render("home");
});


server.post("/log-in",function(req,res){
	req.session.user = req.body.username;
	res.redirect("/app");
});

server.get("/app",function(req,res){
	res.render("app",{user:req.session.user});

});

server.listen(3000);