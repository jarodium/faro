<?php
    interface iCreature {
        
        public function move($pos);
        
        
    }
    
    
    
    class Creature implements iCreature {
        private $session;
        private $stats = [];
        
        public function __construct($stats) {
            $this->session = new MDCli("tcp://localhost:5555", true);
            $this->stats = $stats;
        }
        
        public function move($pos) {
            
            $this->stats["pos"] = $pos;
            
            $request = new Zmsg();
            $request->body_set(json_encode($this->stats));
            
            $this->session->send("move", $request);
            $reply = $this->session->recv();
            
        }
    }
?>