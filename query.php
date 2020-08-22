<?php
	function query_sql($connection){
		$sql = "SELECT * FROM `bom_data` ORDER BY `unit_price` ASC";
		$result = $connection->query($sql);
		return $result;	
	}
?>
