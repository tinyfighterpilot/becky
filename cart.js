let total = parseFloat(localStorage.getItem('cartTotal')) || 0;

function addItem(price) {
    total += price;
    localStorage.setItem('cartTotal', total);
    updateCart();
}

function updateCart(){
    document.getElementById("totalPrice").innerHTML = "$" + total.toFixed(2);

}

window.onload = function(){
    updateCart();
}