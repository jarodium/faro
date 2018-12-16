var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var zmq = require('zeromq');
var responder = zmq.socket('rep');

var clients = []; //store the clients
var clientsCoords  = [];
server.listen(3000);

/**
 * APP Server LOGIC
 * 
*/
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/server/index.html');
});


io.on('connection', function (client) {
  clients.push(client); 
  clientsCoords.push('');
  
  client.on('disconnect', function() {
    clientsCoords.splice(clientsCoords.indexOf(client), 1);
    clients.splice(clients.indexOf(client), 1);
  });
  
  io.on('updateCoord', function (client, msg) {
    var ind = clients.indexOf(client);
    if (ind != -1) {
      clientsCoords[ind] = msg;
      console.log('I received a private message by ', client, ' saying ', msg);
      client.broadcast.emit('coordsUpdated',JSON.stringify(clientsCoords));
    }
  });
});






/**
 * ZMQ LOGIC *
 * 
*/
responder.on('message', function(request) {
  console.log("Received request: [", request.toString(), "]");

  // do some 'work'
  setTimeout(function() {

    // send reply back to client.
    responder.send("World");
  }, 1000);
});

responder.bind('tcp://*:6666', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 6666…");
  }
});

process.on('SIGINT', function() {
  responder.close();
});