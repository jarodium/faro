// person.js
'use strict';
const zmq = require('zeromq');
var requester;
const chalk = require('chalk');
const log = console.log;

class Creature {
    constructor(stats) {
        this.Engine = require(__dirname+"/engine_utils");
        this.stats = stats;     
        this._inEncounter = false;  //in Encounter with something         
    }

    debug() {       
       console.log(this.stats);    
       console.log(this.Engine);
       //console.log(this.id); // log de uma propriedade do obj extendido
    }
    __connect() {                        
        requester = zmq.socket('req');         
        
        requester.on("message", function(reply) {
            var MSG = reply.toString();
            MSG = MSG.slice(MSG.indexOf("{"),MSG.lastIndexOf("}")+1);
            MSG = JSON.parse(MSG);
            
            //console.log(MSG);

            if (MSG.cmd == "creature-kill" || MSG == "server-shutdown") { 
                //console.log("creature exiting");                
                requester.close();
                process.exit(0);
            }
            
        });
    
        requester.connect("tcp://localhost:6666");            

        let payload = {
            'cmd' : 'creature-spawn',
            'stats' : this.stats
        }
        
        requester.send(JSON.stringify(payload));

       
        process.on('SIGINT', function() {                   
            requester.close();
            process.exit(0);
        });
        process.on('SIGTERM', function() {                                    
            requester.close();
            process.exit(0);
        });
    }
    __actualizarFOV(origin) {
        /*
        *   Função para actualizar o Campo de Visão da Criatura
        *   O Campo de Visão irá ser utilizado para determinar os contactos entre a criatura e o jogador
        */       
      this.stats._fovPol = this.Engine.calculateFOV(origin,this.stats.fov,this.stats.fovd);
    }
    __fazMovimento() {
        /*
        * Esta função invoca o próximo movimento com base no tempo que leva para o próximo ponto 
        */
        //log(chalk.blue('Creature movement set with '+this.wayPoints.length+" moves"));   
        var lastPoint = {};

        if (this.wayPoints.length > 0) {

            var nextPoint = this.wayPoints.shift();                
            nextPoint.id = this.stats.id;
            let timeOutSpeed = (1000*nextPoint.duration) * (parseInt(this.stats.speed,10) / 100);
                //descomentar linha abaixo para debug
            //let timeOutSpeed = Math.floor((1000*nextPoint.duration) * ( parseInt(this.stats.speed,10) / 100)/100);
            this.__actualizarFOV(nextPoint);
            
            let payload = {
                'cmd' : 'creature-maneuver',                
                'destination' : nextPoint,
                'fov' : this.stats._fovPol
            }   
            requester.send(JSON.stringify(payload));  
                        
            //log(chalk.yellow('Creature moving in '+timeOutSpeed+"ms"));
            var imacreature = this;
            setTimeout(function() {
                //log(chalk.green('creature moved'));
                //log(nextPoint);  
                if (imacreature._inEncounter == false) {
                        //they see me rollin' they hatin'
                    imacreature.__fazMovimento();                
                    lastPoint = nextPoint;
                }                
            },timeOutSpeed);
        }
        else {
            if (lastPoint.hasOwnProperty("long") && lastPoint.hasOwnProperty("lat")) {
                //log(chalk.red('end of travel'));            
                this.startingPoint = [lastPoint.long,lastPoint.lat];
            }
            else {
                this.startingPoint = this.Engine.getRandomGPS(this.Engine.FARO_BOUNDS);
            }
            this.destinationPoint = this.Engine.getRandomGPS(this.Engine.FARO_BOUNDS);
            // chamar outra vez o __iniciarRota para construir o array de novo
            this.__iniciarRota();            
        }                       
    }
    __iniciarRota() {
       
        this.Engine.mapBoxWaypoints(this.startingPoint,this.destinationPoint,this.stats._mapbox_profile).
        then(data => {
            this.wayPoints = data;
            this.__fazMovimento();
        }).catch(error => console.log(error));    
    }
    __bringmetolife() {     
        //console.log(this.stats);
        //escolher um dos pontos de spawn aleatoriamente do mapa  
        this.startingPoint = this.Engine.getRandomGPS(this.Engine.FARO_BOUNDS);
        this.destinationPoint = this.Engine.getRandomGPS(this.Engine.FARO_BOUNDS);                 
        this.__iniciarRota();    
        
    }

}

class Dragon extends Creature {
    constructor(stats) {        
        super(stats);                
    }       
}

module.exports = {
    Dragon    
};