<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
include('./includes/openDbconn.php');

$sql = "SELECT MAX(attributeID) as MaxNum FROM attributes";

$result      = mysqli_query($db,$sql);


if(empty($result))
{	
	//Boundary case for when there are no images
	$nextNumber=1;
}
else
{
	$row = mysqli_fetch_array($result);
	$nextNumber=trim($row["MaxNum"]);
	$nextNumber++;
}	

echo json_encode($nextNumber);

include("./includes/closeDbConn.php");

?>