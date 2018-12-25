<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
include('./includes/openDbconn.php');

$data=json_decode(file_get_contents("php://input"), true);
if(isset($data)){
    $sql="SELECT * FROM evacomment WHERE thesisID = '".$data['thesisID']."' AND comID='".$data['comID']."'";
    $result=mysqli_query($db,$sql);
    //echo $sql;
    $row=array();
    while($r=$result->fetch_assoc()){
    $row[]=$r;    
    }
    echo json_encode($row);
}

include("./includes/closeDbConn.php");

?>