<?php
    interface iCreature {
        
        public function move();
        public function getRoute($destpos);
        
    }
    
    
    
    class Creature implements iCreature {
        private $mapbox;
        private $session;
        private $stats = [];
        private $spawn_points = [];
        private $spawn_points_copy = [];
        private $iri = 0; //internal route index;
        
        public function __construct($stats) {
            if (count($stats["spawn_points"]) % 2 == 0) {
                $this->mapbox = $mapbox = new Mapbox(MAPBOXK);	
                //$this->session = new MDCli("tcp://localhost:5555", true);
                $context = new ZMQContext();
                $this->session = new ZMQSocket($context, ZMQ::SOCKET_REQ);
                $this->session->connect("tcp://localhost:6666");
                
                $this->spawn_points = $stats["spawn_points"];
                $this->spawn_points_copy = $stats["spawn_points"];
                unset($stats["spawn_points"]);
                
                $this->stats = $stats;
                
                shuffle($this->spawn_points);
                
                
                
                $this->stats["pos"]["radius"] = 10; //10 km wide radius for mapbox directions request
                $this->stats["route"] = [];
                
        
                //issues command for node worker to spawn the creature with full features
                $this->__issueCommand("spawn-critter",$this->stats);
            }
            else {
                die("Error! Critters must have even number of spawn points");
            }
        }
        
        private function __issueCommand($nome,$payload) {
            //$request = new Zmsg();
            //$request->body_set(json_encode($payload));
            $this->session->send(json_encode(["cmd" => $nome,"body" =>$payload]));
            
            $reply = $this->session->recv();
            printf ("Received reply %s\n", $reply);
        }
        
        private function __reformatPoints($pos) {
            $pos[0] = number_format($pos[0],4,".","");
            $pos[1] = number_format($pos[1],4,".","");
            
            return $pos;
        }
        
        public function calculateTravelTime($step) {
            //this method will calculate when in time the object should be moving to $step
                //speed is the percentage the object arrives at destination
                    //if from A to B = 4secs, a speed value of 50 results in 2secs
        }
        
        public function getRoute($destpos) {
            
            if ($destpos == $this->stats["pos"]) {
                return [$destpos];
            }
            else {
                
            }
        }
        
        public function move() {
            if (count($this->stats["route"]) == 0) {
                $origin = $this->__reformatPoints(array_shift($this->spawn_points));
                $destination = $this->__reformatPoints(array_shift($this->spawn_points));
                
                $cache_file = "temp/".md5(implode(",",$origin).implode(",",$destination)).".json";
                
                if (file_exists($cache_file)) {
                    $rota = json_decode(file_get_contents($cache_file),true);
                }
                else {
                    $rota = [];
                    $rota[] = [
                        "ori" => $origin[0],
                        "des" => $origin[1]
                    ];
                    
                    $origin = array_reverse($origin);
                    $destination = array_reverse($destination);
                    
                    $res = $this->mapbox->directions(implode(",",$origin),implode(",",$destination),"driving",["steps" => "true"]);    
                    $res = json_decode($res["body"],true);
                    if (isset($res["routes"])) {
                        $steps = $res["routes"][0]["legs"][0]["steps"];
                        //@ Todo - remove from legs all the unnecessary stuff
                        for($i=0; $i<count($steps); $i++) {
                            $rota[] = [
                                "ori" => $steps[$i]["maneuver"]["location"][1],//para o front é invertido
                                "des" => $steps[$i]["maneuver"]["location"][0]
                            ];
                        }
                        unset($steps);
                    }
                    unset($res);
                    file_put_contents($cache_file,json_encode($rta,JSON_UNESCAPED_UNICODE));
                }
                $this->stats["route"] = $rota;
                unset($rota);
                $this->move();
            }
            else {
                //movimentar a creatura para o próximo ponto
                $cmd = ["id" => $this->stats["id"], "nextpos" => $this->stats["route"][$this->iri]];
                $this->iri++;
                $this->__issueCommand("move-critter",$cmd);
                
                //se chegou ao fim da rota
                    //se ainda exisitirem spawn points
                        //fazer uma rota desde o fim da rota para o spawn point seguinte
                    //se não
                        //copiar os spawnpoints da cópia
            }
            
            
        }
    }
?>