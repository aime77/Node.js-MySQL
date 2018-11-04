const mysql = require("mysql");
const inquirer = require("inquirer");
//const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_DATABASE || "bamazon"
});

let dbFunctions = require('./utilities.js')(connection);

connection.connect((err, res) => {
    err ? console.error(`Connection error: ${err.stack}`) : console.log(`Connected as ID: ${connection.threadId}`);
    displayMenu();
});

let options = {
    " View Products for Sale": {},
    " View Low Inventory": {},
    " Add to Inventory": [{
        type: "input",
        message: "Please enter the item ID you would like to add: ",
        name: "getItemID",
        validate: function validateIDnumber(val) {
            return !isNaN(val) || 'Please enter a valid name';
        }
    },
    {
        type: "input",
        message: "Please enter new inventory number: ",
        name: "newInventoryNo",
        validate: function validateIDnumber(val) {
            return !isNaN(val) || 'Please enter a valid inventory number';
        }
    }],
    " Add New Product": [{
        type: "input",
        message: "Please enter the name of the item you would like to add: ",
        name: "newItemName",
        validate: function validateName(name) {
            return name !== '' || 'Please enter a valid name';
        }
    },
    {
        type: "input",
        message: "Please enter the department that this item belongs to: ",
        name: "newItemDept",
        validate: function validateDeptName(name) {
            return name !== '' || 'Please enter a valid name';
        }
    },
    {
        type: "input",
        message: "Please enter the price of this item: ",
        name: "newItemPrice",
        validate: function validatePrice(val) {
            return !isNaN(val) || 'Please enter a valid name';
        }
    }],

    " Exit": {},
}

function displayMenu() {
    inquirer.prompt({
        type: 'rawlist',
        name: 'option',
        message: 'Please select an option: ',
        choices: Object.keys(options)
    }).then(choice => {
        if(choice.option=== Object.keys(options)[1]) viewLowInventory();
        else if (choice.option===Object.keys(options)[0]) dbFunctions.displayItemsTest(10, 45, 42, 10, 10, 10);
                else{
        inquirer.prompt(options[choice.option]).then(answers => {
            switch (choice.option) {
                case Object.keys(options)[2]:
                    addToInventory(answers['getItemID'], answers['newInventoryNo']);
                    break;

                case Object.keys(options)[3]:
                    addNewProduct(answers['newItemName'], answers['newItemDept'], answers['newItemPrice']);
                    break;
            }
        })
    }
    })
}

function viewLowInventory() {
    connection.query(`SELECT stock_quantity FROM products WHERE stock_quantity<6 GROUP BY product_name`, (err, res) => {
        dbFunctions.errorF(err);
        //IMPORTANT:Make table to display results
        console.log(res);
    })
}

function addToInventory(itemID, newInventoryID) {
    connection.query("UPDATE products SET ?? = ??+? WHERE ?", ['stock_quantity', 'stock_quantity', newInventoryID, { item_id: itemID }],
        (err, res) => {
            dbFunctions.errorF(err);
            //IMPORTANT:create general function to display succesful update
            console.log(`Succesful update at row ${connection.affectedRow}`)
        }
    )
} 
//IMPORTANT: Create constructor for new products
function addNewProduct(productName, productDept, productPrice) {
    connection.query('INSERT INTO ?? SET ?', ['products', { product_name: productName, department_name: productDept, price: productPrice }],
        (err, res) => {
            dbFunctions.errorF(err);
            console.log(`Successful insertion at row ${connection.affectedRow}`);
        })
}