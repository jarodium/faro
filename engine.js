const fs = require('fs');
const express = require('express');
const app = express();
var childProcess = require('child_process');
const Engine = require("./modules/engine_utils");
const chalk = require('chalk');
const log = console.log;

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
/**
 * APP Server LOGIC
 * 
*/
app.use("/", express.static(__dirname + '/server'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/server/index.html');
});

/*
  Funções para os users
*/
function updateCoords (clientID,data) {
  log(chalk.yellow('Engine: received player update order'));   
  //log(client);
  var ind = clients.indexOf(clientID);
  //console.log("updating coords");
  //console.log(msg);
  if (ind != -1) {
    clientsCoords[ind] = data;
    log('Engine: client found and updated coordinates');
      //emitir isto quando precisar de atualizar coordenadas em multi jogador
    //client.broadcast.emit('player-coordinates-updated',JSON.stringify(clientsCoords));
    /*let payload = {
      'cmd' : 'encounter-test',
      'clientID' : clientID,
      'data' : data
    };    
    responder.send(JSON.stringify(payload));*/
  }
}

io.on('connection', function (client) {
  clients.push(client.id); 
  clientsCoords.push('');
    //console.log("client online");  
    

  client.on('disconnect', function() {
    clientsCoords.splice(clientsCoords.indexOf(client.id), 1);
    clients.splice(clients.indexOf(client.id), 1);    

  });
  
  client.on('player-moved', function (data) {
    log(chalk.yellow('Engine: received player movement'));    
    updateCoords(client.id,data);
  });

  client.on('web-poll-creatures',function(data) {
    log(chalk.yellow('Engine: received pollcreature order'));    
      //no futuro remover o uso da variavel critters e ler os processos filhos lançados?
    io.sockets.emit('web-poll-creatures-reply',JSON.stringify(critters));
  })

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
    //console.log(critters);
    //io.sockets.emit('web-'+r.cmd,r.stats); //é suposto adicionar uma criatur ao interface web
  }
  if (r.cmd === 'kill-critter') {
    //io.sockets.emit('critterDestroy',r.body);
  }
  if (r.cmd === 'creature-maneuver') {
    //log(chalk.yellow('Engine: received creature maneuver'));
    //log(r.destination);
    io.sockets.emit('web-'+r.cmd,r.destination);
  }
  

  let payload = {
    'cmd' : 'ack'
  };
  // enviar ACK para o cliente para podermos ter uma nova mensagem 
  responder.send(JSON.stringify(payload));
  
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
  console.log('finished running creature');
});

//let latArray = [32.10458, 32.10479, 32.1038, 32.10361];
//let longArray = [34.86448, 34.86529, 34.86563, 34.86486];
// true
//console.log(Engine.isCoordinateInsidePitch(32.104447, 34.865108,latArray, longArray));


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

  console.log("saíndo");
  io.httpServer.close();
  server.close(function () {
    responder.close();     
  });
  process.exit(0);
}

process.on('SIGINT',encerrar);
process.on('SIGTERM', encerrar);