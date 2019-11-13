// person.js
'use strict';

class Creature {
    constructor(stats) {
       this.stats = stats;
       this.moveInterval = 0;              
    }

    debug() {       
       console.log(this.stats);       
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
    __bringmetolife(Engine) {     
        //escolher um dos pontos de spawn
        this.startingPoint = this.stats.spawn_points[Math.floor(Math.random()*this.stats.spawn_points.length)];
        console.log(this.startingPoint);

        /*this.moveInterval = setInterval(function() {
            console.log("move along");
        },100*this.stats.speed);*/
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