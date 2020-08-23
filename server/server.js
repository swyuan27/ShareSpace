var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var config  = require('./config.json');
const{
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatMessage,
  getRoomMod
} = require(__dirname + '/../client/js/game')

app.use(express.static(__dirname + '/../client'));

/*app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});*/



io.on('connection', function (socket) {
  console.log("Somebody connected!");

  socket.on('joinRoom', ({ username, room, setMod }) => {
    
    const user = userJoin(socket.id, username, room, setMod);

    socket.join(user.room);

    // Welcome current user
    //socket.emit('message', formatMessage('ShareBot', 'Welcome to ShareSpace!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage('ShareBot', `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

    io.to(user.room).emit('roomMod', getRoomMod(user.room));

  });

  socket.on('chatMessage', msg => {
    let user = getCurrentUser(socket.id);
    if(msg.includes('/kick')){
      username = msg.substring(msg.search(' ')+1)
      console.log(username)
    }
    else{
      username = user.username;
    }

    io.to(user.room).emit('message', formatMessage(username, msg));
  });

  socket.on('disconnect', () =>{
    console.log('User disconnected');
    const user = userLeave(socket.id);
  });

  socket.on('message', (msg) => {
    
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));

  });



  // Write your code here
});

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, function() {
  console.log("Server is listening on port " + serverPort);
});
