<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
include('./includes/openDbconn.php');

$data=json_decode(file_get_contents("php://input"), true);
if(isset($data['stuID'])){
$sql="INSERT INTO thesis(thesisID, stuID, thesisTitle, comChairID, comChairFirstName,comChairLastName, comMember1ID, comMember1FirstName,comMember1LastName, comMember2ID,comMember2FirstName,comMember2LastName,defenseDate,grade,evaComment)";
$sql.="VALUES('".$data['thesisID']."','".$data['stuID']."','".addslashes($data['thesisTitle'])."','".$data['comChairID']."','".$data['comChairFirstName']."','".$data['comChairLastName']."', '".$data['comMember1ID']."', '".$data['comMember1FirstName']."','".$data['comMember1LastName']."','".$data['comMember2ID']."','".$data['comMember2FirstName']."','".$data['comMember2LastName']."','".$data['defenseDate']."','".$data['grade']."','".addslashes($data['evaComment'])."')";
$result=mysqli_query($db,$sql);
//echo $sql;
echo json_encode($data);
}
include("./includes/closeDbConn.php");

?>