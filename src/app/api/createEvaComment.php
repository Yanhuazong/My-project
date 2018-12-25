<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
include('./includes/openDbconn.php');

$data=json_decode(file_get_contents("php://input"), true);
if(isset($data)){
    $query=array(); 
    foreach($data as $row){
        $query[] = '("'.$row['commentID'].'", "'.addslashes($row['itemName']).'", "'.$row['thesisID'].'", "'.$row['comID'].'", "'.$row['rate'].'", "'.addslashes($row['comment']).'")';
    }
    mysqli_query($db,'INSERT INTO evacomment(commentID, itemName, thesisID, comID, rate, comment) VALUES '.implode(',', $query));
}
echo json_encode($data);

include("./includes/closeDbConn.php");

?>