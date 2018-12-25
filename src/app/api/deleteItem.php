<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
include('./includes/openDbconn.php');

$data=json_decode(file_get_contents("php://input"), true);
$sql="DELETE FROM items where itemID ='".$data."'";
echo $data;
$result=mysqli_query($db,$sql);
include("./includes/closeDbConn.php");

?>