<?php 
@ $db = mysqli_connect("localhost", "root","");
mysqli_select_db($db,"myproject");

// check to see if connection was successful
if(!$db)
{
	echo "Error: Could not connect to database.  Please try again later.";
	exit;
}
?>
