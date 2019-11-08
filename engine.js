var fs = require('fs');
const express = require('express');
const app = express();
var childProcess = require('child_process');

var options = {
  key: fs.readFileSync('./file.pem'),
  cert: fs.readFileSync('./file.crt')
};

function rs(scriptPath, callback) {

  // keep track of whether callback has been invoked to prevent multiple invocations
  var invoked = false;

  var process = childProcess.fork(scriptPath);

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
      if (invoked) return;
      invoked = true;
      callback(err);
  });

  // execute the callback once the process has finished running
  process.on('exit', function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error('exit code ' + code);
      callback(err);
  });

}

var https = require('https');
//var server = require('http').Server(app);
var server = https.createServer(options, app);
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
responder.setsockopt(zmq.ZMQ_LINGER, 0);

responder.on('message', function(request) {
  console.log("Received request: [", request.toString(), "]");
  // do some 'work'
  var r = request.toString();
  r = r.slice(r.indexOf("{"),r.lastIndexOf("}")+1);
  r = JSON.parse(r);
  
  
  if (r.cmd === "creature-spawn") {
    let obj = critters.find(o => o.id === r.stats.id);
    
    if (!obj) { critters.push(r.stats); }

    console.log(critters);
    //io.sockets.emit('critterSpawned',r.stats); //é suposto adicionar uma criatur ao interface web
  }
  if (r.cmd === 'kill-critter') {
    //io.sockets.emit('critterDestroy',r.body);
  }
  if (r.cmd === 'move-critter') {
    //io.sockets.emit('critterMoved',r.body);
  }
  
  /*let payload = {
    'cmd' : 'creature-kill'
  };
  // send reply back to client.
  responder.send(JSON.stringify(payload));*/
  
});

responder.bind('tcp://*:6666', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 6666…");
  }
});

//fazer o spawn da creatura aqui
rs('./spawn_criatura.js', function (err) {
  if (err) throw err;
  console.log('finished running some-script.js');
});


/**
 * LÓGICA DE ENCERRAMENTO
 * 
 */
function encerrar() {
  /*
    Enviar a todos os clientes à escuta para sairem
  */
  let payload = {
    'cmd' : 'server-shutdown'
  };  
  responder.send(JSON.stringify(payload));

  console.log("saíndo");;
  server.close(function () {
    responder.close(); //aqui está a emitir erro que a socket já estava fechada. melhorar o evento de close via CTRL+C e process kill linux
    process.exit(0);
  });
}

process.on('SIGINT',encerrar);
process.on('SIGTERM', encerrar);
