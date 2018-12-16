#!/bin/bash
pkill -f .php
pkill -f "node engine.js";
nohup php server.php & php worker.php & node engine.js