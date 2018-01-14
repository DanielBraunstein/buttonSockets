var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
var counter = 0;

app.use(session({secret: 'codingdojorocks'}));
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('index');
});

var server = app.listen(8000, function() {
	console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	console.log("Client/socket is connected!");
	console.log("Client/socket id is: ", socket.id);
	socket.on("page_loaded", function(){
		console.log("init emit successful");
		console.log(counter);
		socket.emit("updated_counter", counter)
	})
	socket.on("button_pressed", function(){
		counter++;
		console.log("counter = :" + counter);
		//I decided to make this a global emit rather than merely updating the count locally
		//this ensures that connection problems don't de-sync a given client from the server.
		io.emit("updated_counter", counter)
	})

	socket.on("reset_pressed", function(data){
		console.log("reset");
		counter = 0;
		io.emit("updated_counter", counter)
	})


	// all the server socket code goes in here
})