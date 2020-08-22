<?php
function connect_db()
{
	$servername = "localhost";
	$username = "root";
	$password = "*********";
	$dbname = "quoting";
	// create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	//check connection
	if ($conn->connect_error){
		die("connection failed: " . $conn->connect_error);
	}
	return $conn;
}
?>
