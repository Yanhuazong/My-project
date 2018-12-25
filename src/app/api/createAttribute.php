<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
include('./includes/openDbconn.php');

$data=json_decode(file_get_contents("php://input"), true);
if(isset($data['itemID'])){
$sql="INSERT into attributes(attributeID, itemID, attribute) VALUES('".$data['attributeID']."','".$data['itemID']."', '".$data['attribute']."')";
$result=mysqli_query($db,$sql);
echo json_encode($data);
}
include("./includes/closeDbConn.php");

?>