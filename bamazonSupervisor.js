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
    " View Products Sales by Dept": {},
    //IMPORTANT: create function to add roduct and dept
    " Create New Department": [{
        type: "input",
        message: "Please enter the name of the department you would like to add: ",
        name: "newDeptName",
        //IMPORTANT: add to general functions
        validate: function validateDeptName(name) {
            return name !== '' || 'Please enter a valid name';
        }
    },
    {
        type: "input",
        message: "Please enter the over head cost",
        name: "overHeadCost",
        validate: function validateCost(val) {
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
        choices: Object.keys(options),
    }).then(choice => {
        if (choice.option === Object.keys(options)[0]) dbFunctions.displayTableSupervisor();
        else if (choice.option === Object.keys(options)[2]) return false;
        else {
            inquirer.prompt(options[choice.option]).then(answers => {
                if (choice.option === Object.keys(options)[1]) createNewDepartment(answers['newDeptName'], answers['overHeadCost']);
            })
        }
    })
}


function createNewDept() {
    connection.query('INSERT INTO ?? SET ?', ['products', { product_name: productName, department_name: productDept, price: productPrice }],
    (err, res) => {
        dbFunctions.errorF(err);
        console.log(`Successful insertion at row ${connection.affectedRow}`);
    })
}