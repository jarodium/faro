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
        this.moveInterval = 0;              
        
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
            
            console.log(MSG);

            if (MSG.cmd == "creature-kill" || MSG == "server-shutdown") { 
                console.log("creature exiting");
                clearInterval(this.moveInterval);
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
            clearInterval(this.moveInterval);                 
            requester.close();
            process.exit(0);
        });
        process.on('SIGTERM', function() {                        
            clearInterval(this.moveInterval);
            requester.close();
            process.exit(0);
        });
    }     
    __fazMovimento(duracao) {
        /*
        * Esta função invoca o próximo movimento com base no tempo que leva para o próximo ponto 
        */

        //aqui vai ter de levar um settimeout que volta a chamar esta função até completar a chamada ao ultimo way point
            //quando acontecer faz um settimeout para o iniciar rota
    }
    __iniciarRota() {
       
        this.Engine.mapBoxWaypoints(this.startingPoint,this.destinationPoint,this.stats._mapbox_profile).
        then(data => {
            this.wayPoints = data;

            log(chalk.blue('Creature waypoints set'));       
            log(this.wayPoints);
            /*log(this.wayPoints[0]);
            log(this.wayPoints[0].geometry.coordinates[0]);*/
            process.exit(0);
            var imacreature = this;
            
                //iniciar movimento
            //var timer = 100 * self.stats.speed;
            this.moveInterval = setInterval(function() {                    
                log(chalk.blue('creature moving from'));
                //log(imacreature.startingPoint);
                //log(chalk.blue('creature waypoints len:')+imacreature.wayPoints.length);
                if (imacreature.wayPoints.length > 0) {
                    //sacar um elemento dos waypoints array shift   
                        //os waypoints não são comparáveis com o startingpoint e o destination point
                    var nextPoint = imacreature.wayPoints.shift();

                    //log(chalk.blue('creature moving 2'));
                    let payload = {
                        'cmd' : 'creature-maneuver',
                        'destination' : nextPoint
                    }   
                    //log(requester);
                    requester.send(JSON.stringify(payload));  
                    
                    if (imacreature.wayPoints.length == 0) {
                        //log(chalk.blue('no more waypoints'));                            
                        clearInterval(this);
                        
                        //log(nextPoint);
                        //colocar o starting point igual ao next point e sacar um destination random
                        imacreature.startingPoint = nextPoint.maneuver.location;
                        imacreature.destinationPoint = imacreature.Engine.getRandomGPS(imacreature.Engine.FARO_BOUNDS);
                        log(chalk.blue('last goal'));                            
                        log(imacreature.startingPoint);
                        log(imacreature.destinationPoint);
                        // chamar outra vez o __iniciarRota 
                        imacreature.__iniciarRota();
                        imacreature = null;
                    }
                        
                }                       
                //actualizar o starting point e o destination point
                
            },100*imacreature.stats.speed);                            
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