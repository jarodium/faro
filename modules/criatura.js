// person.js
'use strict';

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
        var zmq = require('zeromq');
        var requester = zmq.socket('req');         
        
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
    __calcularRota(startingPoint,destinationPoint) {
        /*
            Função usada para calcular waypoints do ponto A para o ponto B
        */
        //passo 1: perguntar ao map box os caminhos para o destinationPoint
        //passo 3: destinationPoint fica igual ao último ponto dado pelo mapBox
        //passo 4: armazenar o starting point + os way points + o destinationPoint em variavel
    }
    __bringmetolife(Engine) {     
        //escolher um dos pontos de spawn
        this.startingPoint = this.stats.spawn_points[Math.floor(Math.random()*this.stats.spawn_points.length)];
        console.log(this.startingPoint);
        //FAZER : obter um ponto aleatorio GPS para simbolizar o destino e definir como destinationPoint               
        this.wayPoints = this.__calcularRota(startingPoint,destinationPoint);

        /*setTimeout(function() {              
                //iniciar movimento
            this.moveInterval = setInterval(function() {
                console.log("move along");

                //sacar um elemento dos waypoints array shift   
                
                //invocar o creature-moved com o ponto sacado 
                
                //se esse elemento for igual ao destinationPoint
                    //apagar o startingPoint, destinationPoint e o WayPoints
                // chamar outra vez o calcularRota usando o destination Point como starting point e escolhendo de novo um ponto aleatorio                    


            },100*this.stats.speed);
            console.log(this.moveInterval);
        },100)*/
        
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