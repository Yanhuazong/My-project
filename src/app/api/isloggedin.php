<?php

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
//start session
session_start();

if(isset($_SESSION['user'])) {
    echo '{"status": true}';
} else {
    echo '{"status": false}';

}
?>
