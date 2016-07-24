//INITIALIZES THE NPM PACKAGES USED//
var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('console.table');

//INITIALIZES THE CONNECTION VARIABLE TO SYNC WITH A MYSQL DATABASE//
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username//
    password: "ENTER PASSWORD", //Your password//
    database: "Bamazon"
})

//CREATES THE CONNECTION WITH THE SERVER AND MAKES THE TABLE UPON SUCCESSFUL CONNECTION//
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    makeTable();
})

//FUNCTION TO GRAB THE PRODUCTS TABLE FROM THE DATABASE AND PRINT RESULTS TO CONSOLE//
var makeTable = function() {
    //SELECTS ALL OF THE DATA FROM THE MYSQL PRODUCTS TABLE - SELECT COMMAND!
    connection.query('SELECT * FROM Products', function(err, res) {
        if (err) throw err;
        console.table(res);
        promptCustomer(res);
    });
};

//FUNCTION CONTAINING ALL CUSTOMER PROMPTS//
var promptCustomer = function(res) {
        //PROMPTS USER FOR WHAT THEY WOULD LIKE TO PURCHASE//
        inquirer.prompt([{
            type: 'input',
            name: 'choice',
            message: 'What would you like to purchase?'
        }]).then(function(val) {

                //SET THE VAR correct TO FALSE SO AS TO MAKE SURE THE USER INPUTS A VALID PRODUCT NAME//
                var correct = false;
                //LOOPS THROUGH THE MYSQL TABLE TO CHECK THAT THE PRODUCT THEY WANTED EXISTS//
                for (var i = 0; i < res.length; i++) {                    	
	                //1. TODO: IF THE PRODUCT EXISTS, SET correct = true and ASK THE USER TO SEE HOW MANY OF THE PRODUCT THEY WOULD LIKE TO BUY//
                    if( val.choice == res[i].Product_Name){
                        correct = true;

                        console.log('Currently,' + res[i].Stock_Quantity + ' items are on stock.');

                            inquirer.prompt([{
                              type: 'input',
                              name: 'choice2',
                              message: 'How many product you like to buy?'
                            }]).then(function(val2){
                            //2. TODO: CHECK TO SEE IF THE AMOUNT REQUESTED IS LESS THAN THE AMOUNT THAT IS AVAILABLE// 
                                if(val2.choice2 <= res[i].Stock_Quantity){
                                  //3. TODO: UPDATE THE MYSQL TO REDUCE THE StockQuantity by the THE AMOUNT REQUESTED  - UPDATE COMMAND!
                                  current = res[i].Stock_Quantity - val2.choice2;

                                  //4. TODO: SHOW THE TABLE again by calling the function that makes the table
                                  connection.query('UPDATE Products SET Stock_Quantity =' + current + 'WHERE Item_ID =' + res[i].Item_ID + '', function(err,res){
                                        
                                  });
                                  makeTable();
                                }
                                else{
                                  console.log('Please come back next time when stock is available.');
                                  makeTable();
                                }
                            });
                    }
                }

                //IF THE PRODUCT REQUESTED DOES NOT EXIST, RESTARTS PROMPT//
                if (i == res.length && correct == false) {
                    promptCustomer(res);
                }
            });
}