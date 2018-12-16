<?php 
    include("vendor/autoload.php");

    include_once 'includes/class_mdcliapi.php';
    $session = new MDCli("tcp://localhost:5555", true);
    
    $points = [
        [-7.9504845,37.0345556],
        [-7.9424287,37.009778],
        [-7.9185678,37.0092297],
        [-7.9120446,37.0163574],
        [-7.9185555,37.0344528],
        [-7.9504845,37.0345556]
    ];
    
    while (true) {
        shuffle($points);
        
        $request = new Zmsg();
        $request->body_set(json_encode($points[0]));
        $session->send("move", $request);
        
        $reply = $session->recv();
        if (!$reply) {
            echo "fail";
            break;
        }
        sleep(10);
    }
?>