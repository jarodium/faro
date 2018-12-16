<?
    interface iCreature {
        
        public function move($pos);
        
        
    }
    
    
    
    class Creature implements iCreature {
        private $session;
        
        public function __construct($stats = []) {
            $this->session = new MDCli("tcp://localhost:5555", true);
        }
        
        public function move($pos) {
            $request = new Zmsg();
            $request->body_set(json_encode($pos));
            
            $this->session->send("move", $request);
            $reply = $this->session->recv();
            
        }
    }
?>