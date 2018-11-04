const mysql = require("mysql");
const inquirer = require("inquirer");

//const bcrypt = require("bcrypt");
//require('.env').config();

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
  dbFunctions.displayItemsTest(10, 45, 42, 10, 0, 0);
  //setTimefunc or call back to wait displayItems() execution
  buyItem();
});


function buyItem() {
  inquirer.prompt([
    {
      name: 'itemToBuy',
      type: 'input',
      message: "Please select the ID of the item you would like to purchase: ",
      //validate that product is available AND validate that there ar eenought items
    },
    {
      name: "quantityToBuy",
      type: 'input',
      message: "Please select how many units of this item you would like to purchase: ",
    }
  ]).then(answers => {
    connection.query("SELECT * FROM ?? WHERE ?",
      ['products', { item_id: answers.itemToBuy }],
      (err, res) => {
        dbFunctions.errorF(err);
        res.forEach(val => {
          if (answers.quantityToBuy > val.stock_quantity) {
            console.log(`Insufficient quantity!`);
            buyItem();
          }
          else {
            connection.query("UPDATE products SET ?? = ??-? WHERE ?",
              ['stock_quantity', 'stock_quantity', answers.quantityToBuy, { item_id: answers.itemToBuy }], (err, res) => {
                dbFunctions.errorF(err);
                console.log("Sucessful update!");
              })
            connection.query('UPDATE products SET ?? = ??+ (??*?) WHERE ?', ['product_sales', 'product_sales', 'price', answers.quantityToBuy, { item_id: answers.itemToBuy }],
              (err, res) => {
                dbFunctions.errorF(err);
              })
            console.log(`The total you have to pay for the ${val.product_name} is ${val.price}`);
          }

        })
      })
  })
}