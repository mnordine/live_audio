var http = require('http');
var io = require('socket.io');
var fs = require('fs');

// var options = {
// 	key: fs.readFileSync('keys/spdy-key.pem'),
// 	cert: fs.readFileSync('keys/spdy-cert.pem')
// }

var app = http.createServer(function(req, res) {

	req.url = req.url === '/' ? '/index.html' : req.url;

	fs.readFile(__dirname + req.url, function(err, contents) {
		if(err) {
			res.writeHead(500);
			return res.end('error fetching ' + req.url + ': ' + err);
		}

		res.writeHead(200);
		res.end(contents);
	});
});

app.listen(80);
var io = require('socket.io').listen(app);

// Config
io.configure(function() {
	io.set('log level', 0);
	io.set('transports', ['websocket']);
});

io.sockets.on('connection', function(socket) {
	//console.log('connection');
	socket.on('sound_data', function(data) {
		//console.log('received ' + data);
		socket.volatile.broadcast.emit('sound_data', data);
	});
	
});

