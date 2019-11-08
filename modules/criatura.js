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

        process.on('SIGTERM', function() {                        
            requester.close();
            process.exit(0);
        });
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