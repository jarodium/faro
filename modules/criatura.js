// person.js
'use strict';

class Creature {
   constructor(stats) {
       this.stats;       
   }

   debug() {
       console.log(this.stats);
   }
}

module.exports = class Dragon extends Creature {
   constructor(stats,id) {
        super(stats)
        this.id = id;
   }   
}