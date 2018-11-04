function NewProduct(item_id, product_name, department_name, price, stock_quantity){
this.item_id=item_id;
this.product_name=product_name||null;
this.department_name=department_name||null;
this.price=price;
this.stock_quantity=stock_quantity ||null;
}

module.exports=NewProduct;

//let table=new Table()