<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
include('./includes/openDbconn.php');

$data=json_decode(file_get_contents("php://input"), true);
if(isset($data['userID'])){
$hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
$sql="INSERT into users(userID, firstName, lastName, gender, race, email,password, userType)";
$sql.="VALUES('".$data['userID']."', '".$data['firstName']."', '".$data['lastName']."','".$data['gender']."','".$data['race']."','".$data['email']."','".$hashed_password."','".$data['userType']."')";
$result=mysqli_query($db,$sql);
echo json_encode($data);
}
include("./includes/closeDbConn.php");

?>