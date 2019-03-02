# Node.js-MySQL<h1>
Amazon-like storefront app. The app takes in orders from customers and deplete stock from the store's inventory. 

## Dependencies<h2>
* MySQL
* Express
* Node
* Inquirer

## Database Structure<h2>
Customer menu with the following options:
* Displays table with products, prices and department names. If the chosen item is low in stock, asks user to chose a different item. If the quantity the user asks to purchase is higuer than the quantity in stock for that item, asks user to chose a different item. Otherwise, it provides a final price for the item(s) bought.

Manager menu with the following options:
* Option 1 -Display table with product names, department names, prices, stock quantity and product sales
* Option 2 -Displays a table with low in stock items
* Option 3 -Allows manager to add inventory for any product
* Option 4 -Allows manager to enter a new product

Supervisor menu with the following options:
* Option 1 -Diplays a table with: dept name, over head cost, product sales, total profit
* Option 2 -Allows supervidor to add a depatment

## Link to app <h2>
* Click on the following link for a video of the typical user flow through this application: https://youtu.be/1GF3IYAbe60