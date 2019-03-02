require("dotenv").config();

const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "bamazon"
});

let dbFunctions = require("./utilities.js")(connection);

connection.connect((err, res) => {
  err
    ? console.error(`Connection error: ${err.stack}`)
    : console.log(`Connected as ID: ${connection.threadId}`);
  dbFunctions.logoCompany();
  displayMenu();
});

let options = {
  " View Products Sales by Dept": {},
  " Create New Department": [
    {
      type: "input",
      message:
        "Please enter the name of the department you would like to add: ",
      name: "newDeptName",
      validate: function validateDeptName(name) {
        return name !== "" || "Please enter a valid name";
      }
    },
    {
      type: "input",
      message: "Please enter the over head cost",
      name: "overHeadCost",
      validate: function validateCost(val) {
        return !isNaN(val) || "Please enter a valid name";
      }
    }
  ],
  " Exit": {}
};

function displayMenu() {
  inquirer
    .prompt({
      type: "rawlist",
      name: "option",
      message: "Please select an option: ",
      choices: Object.keys(options)
    })
    .then(choice => {
      if (choice.option === Object.keys(options)[0])
        dbFunctions.displayTableSupervisor(displayMenu);
      else if (choice.option === Object.keys(options)[2]) {
        connection.end();
        return false;
      } else {
        inquirer.prompt(options[choice.option]).then(answers => {
          if (choice.option === Object.keys(options)[1])
            createNewDept(answers["newDeptName"], answers["overHeadCost"]);
        });
      }
    });
}

function createNewDept(newDeptName, overHeadCost) {
  connection.query(
    "INSERT INTO ?? SET ?",
    [
      "departments",
      { department_name: newDeptName, over_head_costs: overHeadCost }
    ],
    err => {
      dbFunctions.errorF(err);
      displayMenu();
    }
  );
}
