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

//DEFINICION DE CONTROLADORES
var homeController = require("./app/controllers/home");
homeController(server);

var users = [];

var isntLoggedIn = function(req,res,next){

	if(!req.session.user){
		res.redirect("/");
		return;
	}
	next();
};


server.get("/app", isntLoggedIn, function(req,res){
	res.render("app",{
		user:req.session.user,
		users:users
	});

});

server.io.route("listo?",function (req) {
	req.io.emit("saludo",{message:"serverReady"});
});



server.listen(3000);