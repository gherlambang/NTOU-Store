const orders = JSON.parse(localStorage.getItem('orders')) || [];

//add to the front of the array
export function addOrder(order){
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage(){
  localStorage.setItem('orders', JSON.stringify(orders));
}