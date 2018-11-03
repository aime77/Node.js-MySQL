const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const  genFunct=require("./bamazonCustomer.js")
//const citiTable = require("cli-table");
//const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_DATABASE || "bamazon"
});

connection.connect((err, res) => {
    err ? console.error(`Connection error: ${err.stack}`) : console.log(`Connected as ID: ${connection.threadId}`);
    displayMenu();
});


let options = {
    "1. View Products for Sale": {},
    "2. View Low Inventory": {},
    "3. Add to Inventory": [{
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
    "4. Add New Product": [{
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

    "5. Exit": {},
}

function displayMenu() {

    inquirer.prompt({
        type: 'rawlist',
        name: 'option',
        message: 'Please select and option',
        choices: Object.keys(options)
    }).then(choice => {
        switch (choice.option) {
            case Object.keys(options[0]):
                viewProductsForSale();
                break;
            case Object.keys(options[1]):
                viewLowInventory();
                break;
            case Object.keys(options[4]):
                break;
        }

        inquirer.prompt(options[choice.option]).then(answers => {
            switch (choice.option) {
                case Object.keys(options[2]):
                    addToInventory(answers['getItemID'], answers['newInventoryNo']);
                    break;

                case Object.keys(options[3]):
                    addNewProduct(answers['newItemName'], answers['newItemDept'], answers['newItemPrice']);
                    break;
            }
        })
    })
}

function viewProductsForSale() {
    genFunc.displayItems();
}

function viewLowInventory() {
connection.query(`SELECT inventory_quantity, COUNT(*)c FROM products GROUP by product_name HAVING c<5`, (err, res)=>{
    genFunc.tableDisplay();
})
}

function addToInventory(itemID, newInventoryID) {
    connection.query("UPDATE ?? SET ??=+?? WHERE ?", ['products', stock_quantity, newInventoryID, {item_id:itemID}],
(err, res)=>{
    console.log(`Succesful update at row ${connection.affectedRow}`)
}
)

}

function addNewProduct(productName, productDept, productPrice) {
    connection.query('INSERT INTO ?? SET ?', ['products', { product_name: productName, department_name:productDept, price: productPrice }],
        (err, res) => {
            console.log(`Successful insertion at row ${connection.affectedRow}`);
        })
}