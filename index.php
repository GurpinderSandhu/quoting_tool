<?php include 'connect.php'; ?>
<?php include 'query.php'; ?>

<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
table, th, td {
	border: 1px solid black;
	border-collapse: collapse;
}
th, td {
	padding: 5px;
}

body{
	margin: 0px;
	padding: 0px;
	margin-top: 24px;
}

.topbar{
	overflow: hidden;
	background-color: #db0536; 
	position: fixed;
	top: 0;
	width: 100%;
	display: inline-block;
}

/* The sidepanel menu */
.sidepanel {
  height: 100%; 
  width: 0; 
  position: fixed; 
  top: 0;
  left: 0;
  background-color: #e6e6e6; 
  overflow-x: hidden;
  padding-top: 60px; 
  transition: 0.2s; 
}

.sidepanel a:hover {
  color: #fb3765;
}

.sidepanel .closebtn {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 12px;
  margin-left: 0;
}

.sidepanel .exportbtn {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  margin-right: 0;
}

.openbtn {
  font-size: 12px;
  cursor: pointer;
  background-color: #db0536;
  color: white;
  border: none;
}

.openbtn:hover {
  background-color: #fb3765;
}

.remove{
	color: red;
	font-size:24px;
	cursor: pointer;
}
</style>

<script type= "text/javascript" src="result_query.js"></script>

</head>
<body>
<div class="topbar">
	<button class="openbtn" onclick="openCart()">&#9776; Show Cart</button>
</div>

<div class="logo">	
	<img src= "http://**.**.**.***/logo.jpg" alt="Logo" style = "height:75px;float:right">
</div>

<h1>Quoting Database Tool v1.0</h1>

<div class = "search">
	<form id = "search_form" method = "get" onsubmit="return false;">
	<label> Search Category: </label>
	<select id = "category" name="category" onchange="highlight_column(); filter();">
		<option value="N/A">--Select--</option>
		<option value="hardware_description">Hardware Description</option>
		<option value="hardware_category">Hardware Category</option>
		<option value="manufacturer">Manufacturer</option>
		<option value="manufacturer_PN">Manufacturer PN</option>
		<option value="vendor">Vendor</option>
		<option value="vendor_PN">Vendor PN</option>
		<option value="project_number">Project Number</option>
	</select>
	<label>Search Criteria <input id = "criteria" type="text" name="criteria" onkeyup="filter()" onsubmit="return false;" onfocus="this.value=''"/></label>
	</form> 
</div>

<button onclick="clearCart()">Clear Shopping Cart</button>

<div id = "cart_panel" class = "sidepanel">
	<button class="closebtn" onclick="closeCart()">&#9776;Close Cart</button>
	<button class="exportbtn" onclick="getShoppingCartData()">Export Shopping Cart</button>
	<ul id= "shopping_cart" style="list-style-type:disc"></ul>
	<p id="my_cart"></p>
	<p id = "test1"></p>
</div>

<?php
$conn = connect_db();	
$result = query_sql($conn);
$json = array();
if($result->num_rows >0){
	while($row = $result->fetch_assoc()){
		$json[] = $row;
	}	
}else{echo "0 results";}
?>

<script> 
	var result = <?php echo json_encode($json) ?>;
	var shopping_cart = [];
	if(result!=null){
		gen_table(result);
	}
	export_json = JSON.stringify(shopping_cart);
</script>

<?php
		$export_array = json_decode($_POST['export_json']);
?>

<div id="table_container"></div>
</body>
</html>

