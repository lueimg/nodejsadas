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


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : "nodemysql",
});

connection.connect();

server.io.route("agregar",function (req) {
	
	console.log("ingreso a ser agregado");
	server.io.broadcast("agregando",{data:req.data.posicion});

	
	connection.query('INSERT INTO node SET ?', {descript: req.data.posicion }, function(err, result) {
  if (err) throw err;

  console.log(result.insertId);
	});




});


server.listen(3000);