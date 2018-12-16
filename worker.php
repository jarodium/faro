<?php
error_reporting(E_ALL);
include_once 'includes/class_mdworker.php';

$context = new ZMQContext();
$requester = new ZMQSocket($context, ZMQ::SOCKET_REQ);
$requester->connect("tcp://localhost:6666");

$mdwrk = new Mdwrk("tcp://localhost:5555", "move", false);
$reply = NULL;
while (true) {
    $request = $mdwrk->recv($reply);
    
    $reply = new Zmsg();
    $reply->body_set("200");
    //$mdwrk->send($reply);
    //$session->send("move", $request);
    
    printf ("Sending request to node %s…\n", $request);
    $requester->send($request);

    $replyW = $requester->recv();
    printf ("Received reply [%s]\n", $replyW);
}