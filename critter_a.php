<?php 
    include("vendor/autoload.php");
    include("includes/class_mdcliapi.php");
    include("includes/class_creature.php");
    
    
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