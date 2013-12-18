var express = require("express.io"),
	swig = require("swig"),
	_ = require("underscore");

var server = express();
server.http().io();

var RedisStore = require("connect-redis")(express);

//CONFIGURAR EL MOTOR DE TEMPLATE
server.engine("html",swig.renderFile);
server.set("view engine","html");
server.set("views","./app/views");

server.use(express.static("./public"));


server.configure(function(){
	server.use(express.logger());
	server.use(express.cookieParser());
	server.use(express.bodyParser());


	server.use(express.session({
		secret: "kdshfskdjf",
		store: new RedisStore({})
	}));


});



var users = [];

var isntLoggedIn = function(req,res,next){

	if(!req.session.user){
		res.redirect("/");
		return;
	}
	next();
};

var isLoggedIn = function(req,res,next){

	if(req.session.user){
		res.redirect("/app");
		return;
	}
	next();
};

server.get("/", isLoggedIn, function(req,res){
	//res.send("hola");
	res.render("home");
});


server.post("/log-in",function(req,res){
	users.push(req.body.username);

	server.io.broadcast("log-in",{user:req.body.username});


	req.session.user = req.body.username;
	res.redirect("/app");
});

server.get("/app", isntLoggedIn, function(req,res){
	res.render("app",{
		user:req.session.user,
		users:users
	});

});


server.get("/log-out",function(req,res){
	users  = _.without(users , req.session.user );
	
	server.io.broadcast("log-out",{user:req.session.user });

	req.session.destroy();
	res.redirect("/");

});

server.io.route("listo?",function (req) {
	req.io.emit("saludo",{message:"serverReady"});
});



server.listen(3000);