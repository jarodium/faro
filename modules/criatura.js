// person.js
'use strict';

class Creature {
    constructor(stats) {
       this.stats = stats;       
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
        function __encerrar() {                        
            requester.close();
            process.exit(0);
        }
        process.on('SIGINT',__encerrar);
        process.on('SIGTERM', __encerrar);
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