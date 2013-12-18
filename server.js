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


var homeController = require("./app/controllers/home");
homeController(server,users);

var appController = require("./app/controllers/app");
appController(server,users);


server.io.route("listo?",function (req) {
	req.io.emit("saludo",{message:"serverReady"});
});



server.listen(3000);