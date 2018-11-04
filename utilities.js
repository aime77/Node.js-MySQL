const Table = require("cli-table");

module.exports = function (connection) {
  return ({
    //IMPORTANT:expand on error function
    errorF: function errorF(err) {
      if (err) throw err;
    },

    displayItemsTest: function displayItemsTest(a, b, c, d, e, f) {
      connection.query("SELECT * FROM products", ((err, res) => {
        this.errorF(err);
        var table = new Table({
          head: [`Item ID`, `Product`, `Department`, `Price`, `Inventory`, `Sales`]
          , colWidths: [a, b, c, d, e, f]//10, 45, 42, 10, 10, 10
          , style: { compact: true, 'padding-left': 1 }
        });

        for (let row of res) {
          table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity, row.product_sales]);
        }
        console.log(table.toString());
      })
      )
    },

    //getItemID: function getItemID() {
    //  connection.query("SELECT item_id FROM products", ((err, res) => {
    //    if (err) throw err;
    //  let arrayIDs = [];
    //res.forEach(val => {
    //  arrayIDs.push(val.item_id);
    //})
    //console.log(arrayIDs.map(String));
    //return arrayIDs.map(String);
    //}))
    //},
    //IMPORTANT: Validate NULL values in table
    displayTableSupervisor: function displayTableSupervisor() {
      var select='SELECT department_id, department_name, over_head_costs, product_sales,SUM(over_head_costs-product_sales) AS total_profit FROM products INNER JOIN departments USING (department_name) GROUP BY  department_name';
      connection.query(select, ((err, res) => {
        this.errorF(err);
        let table = new Table({
          head: ['ID', 'Dept. Name', 'Over Head Cost', 'Sales', 'Profit']
          , colWidths: [10, 30, 10, 10, 10]
          , style: { compact: true, 'padding-left': 1 }
        });

        for (let row of res) {
          table.push([row.department_id, row.department_name, row.over_head_costs, row.product_sales, row.total_profit]);
        }
        console.log(table.toString());
      })
      )
    }

  }
  );
};

