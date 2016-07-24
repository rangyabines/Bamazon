//INITIALIZES THE NPM PACKAGES USED//
var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('console.table');

//INITIALIZES THE CONNECTION VARIABLE TO SYNC WITH A MYSQL DATABASE//
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username//
    password: "Driven@nz198!", //Your password//
    database: "Bamazon"
})

//CREATES THE CONNECTION WITH THE SERVER AND MAKES THE TABLE UPON SUCCESSFUL CONNECTION//
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    menu();
})

//FUNCTION OF MENU OPTIONS
var menu = function() {
	inquirer.prompt([{
		name: "menu",
		type: "list",
		message: "Select an option: ",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}]).then(function(response) {
		switch(response) {
		  case 'View Products for Sale': 
		    viewProducts();
		    break;
		  case 'View Low Inventory':
		    lowInventory();
		    break;
		  case 'Add to Inventory':
		    addInventory();
		    break;
		  case 'Add New Product':
		    addProduct();
		    break;
		}
	})
}

