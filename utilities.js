const Table = require("cli-table");

module.exports = function (connection) {
  return ({
    //IMPORTANT:expand on error function
    errorF: function errorF(err) {
      if (err) console.error(`Error connecting ${err.stack}`);
    },
    //IMPORTANT: Imrove layout of tables
    displayItemsTest: function displayItemsTest(a, b, c, d, e, f, cb) {
      connection.query("SELECT * FROM products", ((err, res) => {
        this.errorF(err);
        var table = new Table({
          head: [`Item ID`, `Product`, `Department`, `Price`, `Inventory`, `Sales`]
          , colWidths: [a, b, c, d, e, f]//10, 45, 42, 10, 10, 10
          , style: { 'padding-left': 1 }
        });

        for (let row of res) {
          table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity, row.product_sales]);
        }
        console.log(table.toString());
        cb();
      })
      )
    },
    consoleMsg: function consoleMsg(res) {
      res.forEach(val => {
        console.log(`Successful insertion at row ${val.item_id}`);
      })
    },
    getItemID: function getItemID() {
      connection.query("SELECT item_id FROM products", ((err, res) => {
        this.errorF(err);
        let arrayIDs = [];
        res.forEach(val => {
          arrayIDs.push(val.item_id);
        })
        return arrayIDs;
      }))
    },
    //IMPORTANT: Validate NULL values in table
    displayTableSupervisor: function displayTableSupervisor(cb) {
      var select = 'SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) as sales, SUM(over_head_costs-products.product_sales) AS total_profit FROM departments LEFT JOIN products USING (department_name) GROUP BY department_name';
      connection.query(select, ((err, res) => {
        this.errorF(err);
        let table = new Table({
          head: ['ID', 'Dept. Name', 'Over Head Cost', 'Sales', 'Profit']
          , colWidths: [10, 30, 10, 10, 10]
          , style: {'padding-left': 1 }
        });

        for (let row of res) {
          if(row.sales==null||row.total_profit==null){row.sales=0;row.total_profit=0 }

          table.push([row.department_id, row.department_name, row.over_head_costs, row.sales, row.total_profit]);
        }
        console.log(table.toString());
        cb();
      })
      )
    },
    logoCompany: function logoCompany() {
      console.log('========================================\n               ANTHROPO                \n========================================')
    },
    tableOutOfStock: function tableOutOfStock(a,b,c,d,e,f,cb) {
      connection.query(`SELECT * FROM products WHERE stock_quantity<6 GROUP BY product_name`, ((err, res) => {
        this.errorF(err);
        var table = new Table({
          head: [`Item ID`, `Product`, `Department`, `Price`, `Inventory`, `Sales`]
          , colWidths: [a, b, c, d, e, f]//10, 45, 42, 10, 10, 10
          , style: { 'padding-left': 1 }
        });

        for (let row of res) {
          table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity, row.product_sales]);
        }
        console.log(table.toString());
        cb();
      })
    )
    },
    displayItemsCustomer: function displayItemsCustomer(a, b, c,d,cb) {
      connection.query("SELECT item_id, product_name, department_name, price FROM products", ((err, res) => {
        this.errorF(err);
        var table = new Table({
          head: [`Item ID`, `Product`, `Department`, `Price`]
          , colWidths: [a, b, c,d]//10, 45, 42, 10, 10, 10
          , style: { 'padding-left': 1 }
        });

        for (let row of res) {
          table.push([row.item_id, row.product_name, row.department_name, row.price]);
        }
        console.log(table.toString());
        cb();
      })
      )
    },

  })};

