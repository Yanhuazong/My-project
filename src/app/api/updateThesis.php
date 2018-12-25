<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
include('./includes/openDbconn.php');

$data=json_decode(file_get_contents("php://input"), true);
if(isset($data['thesisID'])){
$sql="UPDATE thesis SET thesisTitle = '".addslashes($data['thesisTitle'])."', comChairID = '".$data['comChairID']."', comChairFirstName = '".$data['comChairFirstName']."',comChairLastName = '".$data['comChairLastName']."', comMember1ID = '".$data['comMember1ID']."', comMember1FirstName = '".$data['comMember1FirstName']."',comMember1LastName ='".$data['comMember1LastName']."', comMember2ID = '".$data['comMember2ID']."',comMember2FirstName = '".$data['comMember2FirstName']."',comMember2LastName ='".$data['comMember2LastName']."',defenseDate ='".$data['defenseDate']."' WHERE thesisID ='".$data['thesisID']."'";
// echo($sql);
// exit;
$result=mysqli_query($db,$sql);
echo json_encode($data);
}
include("./includes/closeDbConn.php");

?>