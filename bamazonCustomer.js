const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const Table = require("cli-table");
//const bcrypt = require("bcrypt");
//require('.env').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "bamazon"
});

connection.connect((err, res) => {
  err ? console.error(`Connection error: ${err.stack}`) : console.log(`Connected as ID: ${connection.threadId}`);
  displayItems();
  //getItemID();
});

function errorF(err) {
  if (err) throw err;
}

function displayItems() {
  connection.query("SELECT * FROM products", ((err, res) => {
    errorF(err);
    var table = new Table({
      head: ['Item ID', 'Product', 'Department', 'Price', 'Quantity']
      , colWidths: [10, 45, 42, 10, 10]
      , style: { compact: true, 'padding-left': 1 }
    });

    for (let row of res) {
      table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity]);
    }
    console.log(table.toString());
  })
  )
  getItemID()
}

function buyItem(ids) {
  //getItemID();
  inquirer.prompt([
    {
      name: 'itemToBuy',
      type: 'rawlist',
      message: "Please select the ID of the item you would like to purchase: ",
      choices: ids,
    },
    {
      name: "quantityToBuy",
      type: 'input',
      message: "Please select how many units of this item you would like to purchase.",
    }
  ]).then(answers => {
    var columns = ['stock_quantity', 'price', 'product_name'];
    connection.query("SELECT ?? FROM ?? WHERE ?",
      [columns, 'products', { item_id: answers.itemToBuy }],
      
      (err, res) => {
        errorF(err);
        res.forEach(val=>{
        if (answers.quantityToBuy > val.stock_quantity) console.log(`Insufficient quantity!`);
        else {
          connection.query("UPDATE products SET ?? = -? WHERE ?",
            ['stock_quantity', answers.quantityToBuy, { item_id: answers.itemToBuy }], (err, res) => {
              errorF(err);
              console.log("Sucessful update!");
            })
        }
        console.log(`The total you have to pay for the ${val.product_name} is ${val.price}`);
      })
      })
  })
}


function getItemID() {
  connection.query("SELECT item_id FROM products", ((err, res) => {
    errorF(err);
    let arrayIDs = [];
    res.forEach(val => {
      arrayIDs.push(val.item_id);
    })
    buyItem(arrayIDs.map(String));

  }))
}

module.exports = {
  displayItems: displayItems,
  getItemID: getItemID,
  errorF:errorF
};


//function getItemID(){
//connection.query("SELECT item_id FROM products", ((err, res)=>{
//var array=res.map(val=>{
//return{ 
//value: val.item_id,
//array:array,
//}
//})
//}))
//}