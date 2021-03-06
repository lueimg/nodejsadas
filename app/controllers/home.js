var _ = require("underscore");

	var homeController  = function(server,users){
		console.log("module home cargado");


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

	server.get("/log-out",function(req,res){
		users  = _.without(users , req.session.user );
		
		server.io.broadcast("log-out",{user:req.session.user });

		req.session.destroy();
		res.redirect("/");

	});



};

module.exports  = homeController;
