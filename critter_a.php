<?php 
    include("vendor/autoload.php");
    include("includes/class_mdcliapi.php");
    include("includes/class_creature.php");
    include("includes/mapbox_driver/Mapbox.php");
    
    $CFG = json_decode(file_get_contents("config.json"),true);
    define("MAPBOXK",$CFG["mapboxkey"]);
    
    $points = [
        [37.0212903,-7.9414567],
        [37.0189683,-7.9326587]
    ];
    
    $critter = new Creature(
        ["id" => "DRGN01","name" => "Dragon","spawn_points" => $points,"speed" => 50]
    );
    
    while (true) {
        $critter->move();
        
        sleep(10);
    }
?>