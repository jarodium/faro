#!/bin/bash
pkill -f .php
nohup php server.php & php worker.php
#nohup node server.js