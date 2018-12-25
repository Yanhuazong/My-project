<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
include('./includes/openDbconn.php');

$data=json_decode(file_get_contents("php://input"), true);
if(isset($data)){
    foreach($data as $row){
        $query = 'UPDATE evaresult SET itemName="'.addslashes($row['itemName']).'", attributeName="'.addslashes($row['attributeName']).'", optionSelected="'.addslashes($row['optionSelected']).'" WHERE resultID="'.$row['resultID'].'"';
        mysqli_query($db,$query);
    }
}
echo json_encode($data);

include("./includes/closeDbConn.php");
?>
