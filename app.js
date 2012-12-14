var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

// Static server
function handler(req, res) {

	console.log(req.url);

	var url = req.url;
	if(req.url === '/') {
			url = '/index.html';
	}

	//console.log(url);

	fs.readFile(__dirname + url, function(err, contents) {
		if(err) {
			res.writeHead(500);
			return res.end('error fetching ' + url + ': ' + err);
		}

		res.writeHead(200);
		res.end(contents);
	});
	
}

app.listen(8080);

// Config
io.configure(function() {
	io.set('log level', 0);
	io.set('transports', ['websocket']);
});

io.sockets.on('connection', function(socket) {
	//console.log('connection');
	socket.on('sound_data', function(data) {
		//console.log('received ' + data);
		socket.broadcast.emit('sound_data', data);
	});
	
});