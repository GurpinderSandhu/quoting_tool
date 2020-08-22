//Quoting Database Tool rev 1.1
//Written and maintained by: Gurpinder Sandhu

//-----------------Improvements and Ideas---------------------------------//
// - in "show cart" side panel, each item should be a div element like a card showing name and price
// - be able to remove items from show cart panel?
// - perfered vendor list in database as new table, read them , font colour green or red in vendor col
// - admin page to add/remove project data from database
// - or filter data by year? 
// - highlight text in searched column as it matches user input
//------------------------------------------------------------------------//

/*Notes from Meeting on August 17 2020
- (done) Fix when uncheck mark, remove from panel
- (done) Be able to search vendor_PN
- (done) Color coded dates
- (done) Lead times
- (done) Color coded lead times
- Remove older data
- somehow get web pricing?
- for duplicates only show latest item
*/

//----------------More than __ days from today colours------------------//
//for order dates
var days_red = 120;
var days_yellow = 90;

//lead times
var lt_red = 28;
var lt_yellow = 21;

var red_hex = "ffe6e6";
var yellow_hex = "#ffffcc";
var green_hex = "#e6ffe6";
//----------------------------------------------------------------------//

var export_array = [];

var column_names = ["add",
	"id",
	"hardware_category",
	"hardware_description",
	"lead_time",
	"manufacturer",
	"manufacturer_PN",
	"vendor",
	"vendor_PN",
	"website",
	"order_date",
	"currency",
	"unit_price",
	"project_number"];

var export_column_names = ["hardware_category",
	"hardware_description",
	"lead_time",
	"manufacturer",
	"manufacturer_PN",
	"vendor",
	"vendor_PN",
	"website",
	"vendor_quote_number",
	"currency",
	"unit_price",
	"preq_number",
	"PO_number",
	"order_date",
	"project_number"];

export_array.push(export_column_names);

function gen_table(result){

	var perrow = column_names.length;
	var cell_count = 0;
	var row_count = 0;

	var table = document.createElement("table");;
	var header = table.createTHead();
	header.setAttribute("id","whole_table");
	
	var row = header.insertRow();

	//header row
	for (var col of column_names){
		//first row headers
		if(row_count == 0){
			var cell = row.insertCell();
			cell.innerHTML = col;
			cell.style.fontWeight = "900";
			cell_count++;
			if (cell_count%perrow==0){
				row = table.insertRow();
			}
		}
	}
	//data rows
	for (var ele of result){
		for (var col of column_names){
			
			var cell = row.insertCell();
			cell.innerHTML = replaceComma(ele[col]);
			
			if(col == "add"){
				cell.innerHTML = "";
				create_checkbox(cell,ele["id"]);
			}
			if(col == "lead_time" && parseInt(ele[col]) != 0){
				lt = parseInt(ele[col]);
				if(lt >lt_red){
					cell.style.backgroundColor = red_hex;
				}else if(lt >= lt_yellow && lt < lt_red){
					cell.style.backgroundColor = yellow_hex;
				}else{
					cell.style.backgroundColor = green_hex;
				}
			}
			//make hyperlink of website
			if(col == "website" && ele[col] != ""){
				var str = "Link";
				cell.innerHTML = '<a href="'+ele[col]+'" target="_blank">'+str+'</a>'
			}
			if(col == "order_date"){
				var order_date_array = ele[col].split('-');		//YYYY-MM-DD
				var order_date_obj = new Date(order_date_array[0],order_date_array[1],order_date_array[2])
				var current_date = new Date()
				var diff = Math.abs(current_date - order_date_obj) / 86400000;
				if(order_date_array[0]!= 0){
					if(diff >= days_red){
						cell.style.backgroundColor = red_hex;
					}else if(diff >= days_yellow && diff < days_red){
						cell.style.backgroundColor = yellow_hex;
					}else{
						cell.style.backgroundColor = green_hex;
					}
				}
			}
			cell_count++;
			if (cell_count%perrow==0){
				row = table.insertRow();
			}
		}
		row_count++;
	}
	document.getElementById("table_container").appendChild(table);
}

function create_checkbox(cell,id){
	var chkbox = document.createElement("INPUT");
	chkbox.setAttribute("type", "checkbox");
	chkbox.setAttribute("id",id);
	chkbox.onchange = add_to_cart;
	cell.appendChild(chkbox);
}

function add_to_cart(){
	//given id, add to a list
	var tmp_id = this.parentElement.parentElement.cells[1].innerHTML;
	var tmp_hardware = this.parentElement.parentElement.cells[3].innerHTML;
	var shoplist = document.getElementById("shopping_cart").getElementsByTagName("li");
	if(this.checked){
		shopping_cart.push(tmp_id);
		appendElement(tmp_hardware,tmp_id);
	}else{
		//remove id from list
		for (var i = 0; i < shoplist.length; i++){
			if(shoplist[i].innerHTML.substring(29) == tmp_hardware){
				document.getElementById("shopping_cart").removeChild(shoplist[i]);
			}
		}
		const index = shopping_cart.indexOf(tmp_id);
		if (index > -1){
			shopping_cart.splice(index,1);
		}
	}
}

function filter() {
	var input, filter, table, tr, td, i, txtValue;
	input = document.getElementById("criteria");
	filter = input.value.toUpperCase();
	table = document.getElementById("whole_table");
	tr = table.getElementsByTagName("tr");
	for (i = 1; i < tr.length; i++) {
	  td = tr[i].getElementsByTagName("td")[column_names.indexOf(document.getElementById("category").value)];
	  if (td) {
		txtValue = td.textContent || td.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		  tr[i].style.display = "";
		} else {
		  tr[i].style.display = "none";
		}
	  }       
	}
}

function highlight_column(){
	var table = document.getElementById("whole_table");
	var tr = table.rows[0];
	var i;
	for(i = 0; i< tr.cells.length; i++){
		tr.cells[i].style.color = "black";
	}
	if(document.getElementById("category").value != "N/A"){
		tr.cells[column_names.indexOf(document.getElementById("category").value)].style.color = "red";
	}
}

function openCart(){
	document.getElementById("cart_panel").style.width = "500px";
}

function closeCart(){
	document.getElementById("cart_panel").style.width = "0";
}

function appendElement(text){
	var node = document.createElement("li");                
	var removeButton = document.createElement("span");
	removeButton.innerHTML="&times;";
	removeButton.onclick=removeFromPanel;
	removeButton.className = "remove";
	var textnode = document.createTextNode(text);         
	node.appendChild(removeButton);
	node.appendChild(textnode);
	document.getElementById("shopping_cart").appendChild(node);     
}

function getShoppingCartData(){
	var tmp = [];
	for(var id of shopping_cart){
		for (var ele of result){
			if(ele['id']==id){
				for (var col of export_column_names){
					tmp.push(replaceComma(ele[col]));
				}
			}
		}
		export_array.push(tmp);
		tmp = [];
	}
	console.table(export_array);
	toCSV();
	resetExportArray();
}

function resetExportArray(){
	export_array = [];
	export_array.push(export_column_names);
}

function clearCart(){
	var uncheck=document.getElementsByTagName('input');
	for(var i=0;i<uncheck.length;i++){
		if(uncheck[i].type=='checkbox'){
			uncheck[i].checked=false;
		}
	}
	shopping_cart = [];
	document.getElementById("shopping_cart").innerHTML = "";
}

function toCSV(){
	let csvContent = "data:text/csv;charset=utf-8,";
	export_array.forEach(function(rowArray){
		let row = rowArray.join(",");
		csvContent += row + "\n";
	});
	var encodedUri = encodeURI(csvContent);
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.csv");
	document.body.appendChild(link); // Required for FF

	link.click(); // This will download the data file named "my_data.csv".
}

function replaceComma(commaString){
	const regex = /,/g;
	var replacement;
	
	if(commaString == ""){
		replacement = "";
	}else if(commaString == undefined){
		replacement = undefined;
	}else{
		replacement = commaString.replace(regex, ';');
	}
	return(replacement);
}

function removeFromPanel(){
	//on click of "x" in cart, remove from shopping cart and side panel list
	var tmp_hardware = this.parentElement.innerText;
	var hardware = tmp_hardware.split("�").pop();
	var table = document.getElementById("whole_table");
	var rows = table.children;
	var i;
	var id;

	for(i=0; i < rows.length; i++){
		if(rows[i].children[3].innerHTML==hardware){
			id = rows[i].children[1].innerHTML;
			document.getElementById(id).checked = false;
			shopping_cart.splice(shopping_cart.indexOf(id),1);
			break;
		}
	}
	var li = this.parentNode;
	var ul = li.parentNode;
	ul.removeChild(li);
}
