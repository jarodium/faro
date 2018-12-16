<?php
    error_reporting(E_ALL);
    include("includes/class_mdbroker.php");
    $broker = new Mdbroker(false);
    $broker->bind("tcp://*:5555");
    $broker->listen();
?>