const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var zmq = require('zeromq');
var responder = zmq.socket('rep');

var clients = []; //store the clients
var clientsCoords  = [];
var critters = [];

server.listen(3000);

function search(nameKey, prop, myArray){
    k = -1;
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][prop]=== nameKey) {
            k = i;
            break;
        }
    }
    return k;
}
/**
 * APP Server LOGIC
 * 
*/
app.use("/", express.static(__dirname + '/server'));


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
  var r = request.toString();
  r = r.slice(r.indexOf("{"),r.lastIndexOf("}")+1);
  r = JSON.parse(r);
  if (r.cmd === "critter_move") {
    let obj = critters.find(o => o.id === r.id);
    
    if (obj) {
      obj.pos = r.pos;
      
    }
    else {
      critters.push(r);
    }
    io.sockets.emit('crittersUpdated',critters);
  }
  
  
  // send reply back to client.
  responder.send("node 200");
  
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