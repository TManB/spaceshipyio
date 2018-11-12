

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.use('', express.static(__dirname + '/public'));


// MUST BE LAST
app.get('*',function(req, res) {
    console.log("incoming req");
	res.sendFile(__dirname + '/public/index.html');
});

serv.listen(2000);
console.log("server started port 2000");

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player:any = function(id){
	var self = {
		x: 250,
		y: 250,
		id:id,
		number: "" + Math.floor(10 * Math.random()),
		pressingRight: false,
		pressingLeft: false,
		pressingUp: false,
		pressingDown: false,
		maxSpd: 10,
        updatePosition: ()=>{
		if (self.pressingRight){
			self.x += self.maxSpd;
		}
		if (self.pressingLeft){
			self.x -= self.maxSpd;
		}
		if (self.pressingUp){
			self.y -= self.maxSpd;
		}
		if (self.pressingDown){
			self.y += self.maxSpd;
        }
    }
	}
	return self;
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', (sio)=>{
	sio.id = Math.random();
	SOCKET_LIST[sio.id] = sio;

	var player = Player(sio.id);
	PLAYER_LIST[sio.id] = player;

	console.log('socket connected');

	sio.on('disconnect', ()=>{
		delete SOCKET_LIST[sio.id];
		delete PLAYER_LIST[sio.id];
	})

	sio.on('keyPress', (event)=>{
		if (event.inputId === 'left'){
			player.pressingLeft = event.state;
		} else if (event.inputId === 'right'){
			player.pressingRight = event.state;
		} else if (event.inputId === 'up'){
			player.pressingUp = event.state;
		} else if (event.inputId === 'down'){
			player.pressingDown = event.state;
		}
	});

});

setInterval(()=>{
	var pack = [];
	for (var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		player.updatePosition();
		pack.push({
			x:player.x,
			y:player.y,
			num:player.number
		});
	}
		
	// console.log(JSON.stringify(pack));

	for (var i in SOCKET_LIST){

		SOCKET_LIST[i].emit('newPositions', pack);
	}
}, 1000/25)