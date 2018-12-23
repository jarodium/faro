<?php
    interface iCreature {
        
        public function move();
        public function getRoute($destpos);
        
    }
    
    
    
    class Creature implements iCreature {
        private $mapbox;
        private $session;
        private $stats = [];
        
        public function __construct($stats) {
            $this->mapbox = $mapbox = new Mapbox(MAPBOXK);	
            $this->session = new MDCli("tcp://localhost:5555", true);
            
            $this->stats = $stats;
            unset($this->stats["spawn_points"]);
            
            shuffle($stats["spawn_points"]);
            
            
            $this->stats["pos"]["spawn_points"] = $stats["spawn_points"];
            $this->stats["pos"]["radius"] = 10; //10 km wide radius for mapbox directions request
            $this->stats["route"] = [];
            
    
            //issues command for node worker to spawn the creature with full features
            $this->__issueCommand("spawn-critter",$this->stats);
        }
        
        private function __issueCommand($nome,$payload) {
            $request = new Zmsg();
            $request->body_set(json_encode($payload));
            $this->session->send("spawn-critter", $request);
            $reply = $this->session->recv();
            var_dump($payload);
        }
        
        private function __reformatPoints($pos) {
            $pos[0] = number_format($pos[1],4,".","");
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
            if (count($this->stats["route"]) > 0) {
                //movimentar a creatura para o próximo ponto
                $next_pos = array_shift($this->stats["route"]);
                $cmd = ["id" => $this->stats["id"], "nextpos" => $next_pos];
                $this->__issueCommand("move-critter",$cmd);
                
            }
            else {
                //não
                    //invocar a api da mapbox
                        //gravar um ficheiro de cache que memorize a origem e o destino e que contenha os steps devolvidos necessários
                if (count($this->stats["pos"]["spawn_points"]) > 1) {
                    $origin = $this->__reformatPoints(array_shift($this->stats["pos"]["spawn_points"]));
                    $destination = $this->__reformatPoints(array_shift($this->stats["pos"]["spawn_points"]));
                    
                    $cache_file = "temp/".md5(implode(",",$origin).implode(",",$destination)).".json";
                    
                    if (file_exists($cache_file)) {
                        $steps = json_decode(file_get_contents($cache_file),true);
                    }
                    else {
                        $res = $this->mapbox->directions(implode(",",$origin),implode(",",$destination),"cycling",["steps" => "true"]);    
                        $res = json_decode($res["body"],true);
                        if (isset($res["routes"])) {
                            $steps = $res["routes"][0]["legs"][0]["steps"];
                            //@ Todo - remove from legs all the unnecessary stuff
                            for($i=0; $i<count($steps); $i++) {
                                unset($steps[$i]["maneuver"]["instruction"],$steps[$i]["name"],$steps[$i]["mode"],
                                $steps[$i]["intersections"], $steps[$i]["driving_side"], $steps[$i]["geometry"]);
                            }
                        }
                        else {
                            $steps = [];
                        }
                        file_put_contents($cache_file,json_encode($steps,JSON_UNESCAPED_UNICODE));
                    }
                    if (count($steps) > 0) {
                        $this->stats["route"] = $steps;
                        unset($steps);
                    }
                    $this->move();
                }
            }
            
        }
    }
?>