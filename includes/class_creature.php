<?php
    interface iCreature {
        
        public function move($pos);
        public function getRoute($destpos);
        
    }
    
    
    
    class Creature implements iCreature {
        private $session;
        private $stats = [];
        
        public function __construct($stats) {
            $this->session = new MDCli("tcp://localhost:5555", true);
            
            //1º As stats passam a precisar de conter um objecto contendo vários pontos de spawn
            //$stats["spawn_pos"] = [];
            
            //2º ao inicializar a posicao inicial é escolhida aleatoriamente e define uma bearing e 0º ( norte )
            
            //$stats["bearing_pos"] = 0;
            
            //3º As stats precisam de ser inicializadas com um raio de acção para o maxpobx ( min é 10km )
            
            //4º inicializar um array $stats["rota"]
            
            //5º introduzir nas stats o parametro velocidade
                //a velocidade é a percentagem com que a criatura chega ao ponto seguinte.
                //ou seja
                    //se do ponto A ao B leva 4 segundos uma velocidade de 50 leva na realidade 2 segundos
            
            $this->stats = $stats;
            //emitir a mensagem create para o node fazer o render
        }
        
        public function getRoute($destpos) {
            
            if ($destpos == $this->stats["pos"]) {
                return [$destpos];
            }
            else {
                
            }
        }
        
        public function move($pos) {
            
            //o movimento
                //verificar se existem rotas dentro do stats rota 
                    //sim 
                        //movê-lo para a próxima posição do array
                        //shift para fora dessa posição
                    //não
                        //invocar a api da mapbox
                            //gravar um ficheiro de cache que memorize a origem e o destino e que contenha os steps devolvidos necessários
                                //isto faz com que da próxima vez existir um pedido para os mesmo ponto inicial, ter logo os valores gravados
                            //preencher o array de stats rota
                            //chamar o move outra vez com o mesmo parametro
                    //devolver sempre o número de segundos para o sleep e atualizar a bearing after da 
            $this->stats["pos"] = $pos;
            
            $request = new Zmsg();
            $request->body_set(json_encode($this->stats));
            
            $this->session->send("move", $request);
            $reply = $this->session->recv();
            
        }
    }
?>