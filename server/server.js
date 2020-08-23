var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var config  = require('./config.json');

app.use(express.static(__dirname + '/../client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log("Somebody connected!");

  socket.on('disconnect', () =>{
    console.log('User disconnected');
  });

  socket.on('chat message', (msg) => {
    
    io.emit('chat message', msg);
  });




  // Write your code here
});

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, function() {
  console.log("Server is listening on port " + serverPort);
});
