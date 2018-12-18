<?php 
    include("vendor/autoload.php");
    include("includes/class_mdcliapi.php");
    include("includes/class_creature.php");
    include("includes/mapbox_driver/Mapbox.php");
    
    $CFG = json_decode(file_get_contents("config.json"),true);
    $mapbox = new Mapbox($CFG["mapboxkey"]);	
    
    //$res = $mapbox->request("https://api.mapbox.com/directions/v5/mapbox/cycling/-122.42,37.78;-77.03,38.91", "GET");
    $res = $mapbox->directions("-7.9368,37.0206","-7.9299,37.0239","cycling",["steps" => "true"]);
    var_dump($res);
    die();
    
    $points = [
        [-7.9504845,37.0345556],
        [-7.9424287,37.009778],
        [-7.9185678,37.0092297],
        [-7.9120446,37.0163574],
        [-7.9185555,37.0344528],
        [-7.9504845,37.0345556]
    ];
    
    $critter = new Creature(["id" => "DRGN01","name" => "Dragon"]);
    
    while (true) {
        
        
        shuffle($points);
        $critter->move(implode(",",$points[0]));
        
        sleep(10);
    }
?>