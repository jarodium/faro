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
}

class Dragon extends Creature {
    constructor(stats) {        
        super(stats);                
    }       
}

module.exports = {
    Dragon    
};