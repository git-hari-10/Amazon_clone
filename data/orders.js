const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addOrders(order) {
    orders.unshift(order);
    saveOrders();
}

function  saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
}