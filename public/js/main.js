//funciones principales

$().ready(function(){
	window.io = io.connect();

	io.on("connect",function(){
		console.log("hola");
		io.emit("listo?");
	})


	io.on("saludo",function(data){

	});

	io.on("log-in",function(data){
		
		$("#users").prepend("<li>" + data.user + "</li>" )

	});

	io.on("log-out",function(data){
		
		$("#users li").each(function(i,item){
			if(item.innerText === data.user){
				$(item).remove();
			}
		});
	});

}); 