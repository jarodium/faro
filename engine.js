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
  //mover o codigo para dentro do player move do socket io
function updateCoords (clientID,data) {
  log(chalk.yellow('Engine: received player update order'));   
  //log(client);
  var ind = clients.indexOf(clientID);
  //console.log("updating coords");
  //console.log(msg);
  if (ind != -1) {
    clientsCoords[ind] = data;
    //log('Engine: client found and updated coordinates');
      //emitir isto quando precisar de atualizar coordenadas em multi jogador
    //client.broadcast.emit('player-coordinates-updated',JSON.stringify(clientsCoords));
    /*let payload = {
      'cmd' : 'encounter-test',
      'clientID' : clientID,
      'data' : data
    };    
    responder.send(JSON.stringify(payload));*/
    testEncounters(1);
  }
}
function testEncounters(where) {
  //testar encontros entre assets
  //se calhar devia mover isto para outro processo? 
  //ou movia isto para as criaturas?
    //mas a questão é que esta função dá para testar hits para toda a gente

  //algoritmo segue
  log(chalk.yellow('Engine: encounter test '+(where==0 ? 'creature' : 'player')));  
  //log(critters);
  //numbers.forEach((number, index) => console.log(`${index}:${number}`))

  clientsCoords.forEach((coords, index) => {
    
    //log(chalk.blue(coords));  
    var playerPoint = coords.pos;
    var playerFOV = coords._fov_pol; //este é o polígono da visão do jogador
    log(chalk.blue(playerFOV));  
    critters.forEach(critter => {
      //log(chalk.red(critter));  
    });
    //Para cada coordenada cliente ligado
      //verificar se o ponto se encontra:
        //dentro do poligono das criaturas
        //dentro de um polígo de assets ( recursos, etc)
          //se sim emitir um comando para o processo em questão ( ver c1 )
            //após recepção do comando, o gestor do processo em questão, faz o roll dos dados do cliente contra um roll dos dados da criatura
          //se não não faz nada
      //verificar se cada creatura está dentro do alcance do jogador
        //se sim perguntar ao jogador se quer fazer alguma coisa
          //se sim, o cliente devolve um comando para fazer o encontro ( mas a criatura ativa a flag in encounter para se parar. o jogador terá um temporizador de 30 segundos para decidir depois disso liberta a criatura )


      /* Nota: O roll dos dados da criatura decide se o encontro ocorre ou não.
        O roll dos dados do jogador é saber 
      */


  //descrição de payloads
    //c1 {cmd: encounter, id : xxxx, client : cliente_id, client_die: [xxx]}
  });
};

io.on('connection', function (client) {
  clients.push(client.id); 
  clientsCoords.push('');    
    

  client.on('disconnect', function() {
    clientsCoords.splice(clientsCoords.indexOf(client.id), 1);
    clients.splice(clients.indexOf(client.id), 1);    

  });
  
  client.on('player-moved', function (data) {
    //log(chalk.yellow('Engine: received player movement'));    
    /**
     * PARA FAZER - colocar o código de atualização de coordenadas aqui
     */
    updateCoords(client.id,data);   

  });

  client.on('web-poll-creatures',function(data) {
    //log(chalk.yellow('Engine: received pollcreature order'));    
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
  //console.log("Received request: [", request.toString(), "]");
  // do some 'work'
  var r = request.toString();
  r = r.slice(r.indexOf("{"),r.lastIndexOf("}")+1);
  r = JSON.parse(r);
  
  
  if (r.cmd === "creature-spawn") {
    /**
     * Fechada - Não tocar     
     */
    let obj = critters.find(o => o.id === r.stats.id);    
    if (!obj) { critters.push(r.stats); }    

    io.sockets.emit('web-'+r.cmd,r.stats);

  }

  if (r.cmd === 'kill-critter') {
    //io.sockets.emit('critterDestroy',r.body);
  }

  if (r.cmd === 'creature-maneuver') {

    io.sockets.emit('web-'+r.cmd,r.destination);
      //encontrar e actualizar o fov no array de critters
    var ind = critters.findIndex(x => x.id === r.destination.id);    
    if (ind != -1) {      
      //obter o  polígon da criatura em questão
        //até ter o primeiro ponto calculado o r.fov é undefined, mas não deveria ser.
          //[tofix] - deveria estar definido logo quando é definido o startingpoint
      critters[ind]._fovPol = r.fov;              
    }
    //testEncounters(0);
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


//fazer o spawn da creatura n2 aqui
/*rs('./spawn_criatura.js', function (err) {
  if (err) throw err;
  console.log('finished running creature');
});*/
//let latArray = [32.10458, 32.10479, 32.1038, 32.10361];
//let longArray = [34.86448, 34.86529, 34.86563, 34.86486];
// true
//console.log(Engine.isCoordinateInsidePitch(32.104447, 34.865108,latArray, longArray));


/**
 * LÓGICA DE ENCERRAMENTO
 * Fechada
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