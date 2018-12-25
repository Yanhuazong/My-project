<?php
//start session
session_start();
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");

include('./includes/openDbconn.php');

$_POST=json_decode(file_get_contents("php://input"), true);
$email= $_POST["email"];
$password= $_POST["password"];

$sql="SELECT * FROM users WHERE email = '".$email."'";
$result=mysqli_query($db,$sql);
//check to make sure there is a result
if(empty($result))
{
    $num_result=0;
}else
{
    $num_result=mysqli_num_rows($result);
}

if($num_result==0){
    $data='';
}else
{   for($i=0; $i < $num_result; $i++)
    {
    $row = mysqli_fetch_array($result);
    }
    if(password_verify($password,$row["password"])){
    // if($password==$row["password"]){
    $data=$row;
    }else{
    $data='';
    }
}
echo json_encode($data);
include("./includes/closeDbConn.php");
?>
