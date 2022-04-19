
document.addEventListener("DOMContentLoaded", function () {


    // get all the data
    const order_items = fetch('https://storage.googleapis.com/neta-interviews/MJZkEW3a8wmunaLv/items.json').then(e => e.json()).then(e => {
        return e;
    }).catch(err => {
        console.log(err);
        return [];
    });
    const customers = fetch('https://storage.googleapis.com/neta-interviews/MJZkEW3a8wmunaLv/customers.json').then(e => e.json()).then(e => {
        return e;
    }).catch(err => {
        console.log(err);
        return [];
    });;
    const orders = fetch('https://storage.googleapis.com/neta-interviews/MJZkEW3a8wmunaLv/orders.json').then(e => e.json()).then(e => {
        return e;
    }).catch(err => {
        console.log(err);
        return [];
    });;


    // After data is loaded, it loops through order_items (as it is the single row line) and gets from customers and orders specific items for this row
    Promise.all([order_items, orders, customers]).then(values => {
        let order_items = values[0]
        let orders = values[1]
        let customers = values[2]

        // Turn off the loader.
        document.querySelector('.loader_container').style.display = "none";

        // Check if some of the data were not loaded and display the error.
        if (order_items.length === 0 || orders.length === 0 || customers.length === 0) {
            document.querySelector('.error').style.display = "block";
            return;
        }

        // Loop through order items ad display each row.
        order_items.forEach(order_item => {

            // Get current order-item's customer, and order.
            let order = orders.filter(e => { return e.id === order_item.orderId })[0]
            let customer = customers.filter(e => { return e.id === order.customerId })[0]

            // Get the row html template from document, and fill it with the data
            let new_row = fill_row(order, customer, order_item)
            document.querySelector('tbody').appendChild(new_row)

        });
    })

})

function fill_row(order, customer, order_item) {

    // This template is hidden, it is only as a row template. It is easier to manipulate (change, edit, or just check) the HTML directly in the HTML file instead of creating the items by document.createElement.
    let template = document.querySelector(".template");

    template.querySelector('.order_id').innerHTML = order.id;
    template.querySelector('.order_createdAt').innerHTML = order.createdAt;
    template.querySelector('.order_item_id').innerHTML = order_item.id;
    template.querySelector('.order_item_name').innerHTML = order_item.name;
    template.querySelector('.order_item_quantity').innerHTML = order_item.quantity;
    template.querySelector('.customer_firstName').innerHTML = customer.firstName;
    template.querySelector('.customer_lastName').innerHTML = customer.lastName;
    template.querySelector('.customer_addresses_address').innerHTML = customer.addresses[0].address;
    template.querySelector('.customer_addresses_city').innerHTML = customer.addresses[0].city;
    template.querySelector('.customer_addresses_zip').innerHTML = customer.addresses[0].zip;
    template.querySelector('.customer_email').innerHTML = customer.email;

    // Clone the template, so we can remove "template" class from newly created row.
    let new_row = template.cloneNode(true);

    // This removes "template" class, otherwise the row woulod be invisible.
    new_row.className = "";
    return new_row;

} 