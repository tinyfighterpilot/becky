let total = parseFloat(localStorage.getItem('cartTotal')) || 0;

const products = [
    { id: 1, name: "4 Zones of Decluttering", price: 5.00, image: "imgs/YouTube.png" },
    { id: 2, name: "Do I Need This?", price: 1.50, image: "imgs/Do I Really Need This.jpg" },
    { id: 3, name: "Decluttering Check-in", price: 3.00, image: "imgs/YouTube (1).png" },
    { id: 4, name: "ADHD Daily Journal", price: 10.00, image: "imgs/page 1.png" },
    { id: 5, name: "200 Things to Declutter", price: 2.50, image: "imgs/200.png" },
    { id: 6, name: "Capsule Wardrobe", price: 3.00, image: "imgs/winter.png" }
];

// Add item to cart
function addItem(price, productId) {
    const productKey = `p${productId}`;
    const isProductAdded = localStorage.getItem(productKey) === "added";

    if (!isProductAdded) {
        total += price;
        localStorage.setItem('cartTotal', total);
        localStorage.setItem(productKey, "added"); // Mark product as added
        console.log(`Added item: Product ID ${productId}, Total: ${total}`); // Debugging
        updateCart();
        updateProductVisibility(productId, true); // Show product in cart
    } else {
        console.log(`Product ID ${productId} is already in the cart.`); // Debugging
    }
}

// Remove item from cart
function removeItem(price, productId) {
    const productKey = `p${productId}`;
    const isProductAdded = localStorage.getItem(productKey) === "added";

    if (isProductAdded) {
        total -= price;
        localStorage.setItem('cartTotal', total);
        localStorage.setItem(productKey, "removed"); // Mark product as removed
        console.log(`Removed item: Product ID ${productId}, Total: ${total}`); // Debugging
        updateCart();
        updateProductVisibility(productId, false); // Hide product in cart
    } else {
        console.log(`Product ID ${productId} is not in the cart.`); // Debugging
    }
}

// Update the cart total displayed on the page
function updateCart() {
    const totalPriceElement = document.getElementById("totalPrice");
    if (totalPriceElement) {
        totalPriceElement.innerHTML = "$" + total.toFixed(2);
    }
}

// Update product visibility in the cart
function updateProductVisibility(productId, isVisible) {
    const productDiv = document.getElementById(`p${productId}`);
    if (productDiv) {
        productDiv.style.display = isVisible ? "block" : "none";
    }
}

// On page load (for cart.html)
// On page load (for cart.html)
window.onload = function () {
    console.log("Page loaded. Generating product divs..."); // Debugging
    updateCart();

    const productContainer = document.getElementById("productContainer");
    if (productContainer) {
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.id = `p${product.id}`;
            productDiv.style.display = "none"; // Start with all products hidden

            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;

            const productInfo = document.createElement('div');
            productInfo.className = 'product-info';

            const h3 = document.createElement('h3');
            h3.textContent = product.name;

            const p = document.createElement('p');
            p.textContent = `$${product.price.toFixed(2)}`;

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-button';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => removeItem(product.price, product.id));

            productInfo.appendChild(h3);
            productInfo.appendChild(p);
            productInfo.appendChild(removeButton);

            productDiv.appendChild(img);
            productDiv.appendChild(productInfo);

            productContainer.appendChild(productDiv);
            console.log(`Generated div for product ID: p${product.id}`); // Debugging
        });

        // Initialize product visibility based on localStorage
        products.forEach(product => {
            const productKey = `p${product.id}`;
            const isProductAdded = localStorage.getItem(productKey) === "added";
            updateProductVisibility(product.id, isProductAdded);
        });
    }
};

paypal.Buttons({
    style: {
        layout: 'horizontal'
    },

    // Call your server to set up the transaction
    //called on click, my server returns orderID
    createOrder: function(data, actions) {
        return fetch('/demo/checkout/api/paypal/order/create/', {
            method: 'post'
        }).then(function(res) {
            return res.json();
        }).then(function(orderData) {
            return orderData.id;
        });
    },

    // Call your server to finalize the transaction
    //after user approves payment
    onApprove: function(data, actions) {
        return fetch('/demo/checkout/api/paypal/order/' + data.orderID + '/capture/', {
            method: 'post'
        }).then(function(res) {
            return res.json();
        }).then(function(orderData) {
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you

            // This example reads a v2/checkout/orders capture response, propagated from the server
            // You could use a different API or structure for your 'orderData'
            var errorDetail = Array.isArray(orderData.details) && orderData.details[0];

            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                return actions.restart(); // Recoverable state, per:
                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
            }

            if (errorDetail) {
                var msg = 'Sorry, your transaction could not be processed.';
                if (errorDetail.description) msg += '\n\n' + errorDetail.description;
                if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
                return alert(msg); // Show a failure message (try to avoid alerts in production environments)
            }

            // Successful capture! For demo purposes:
            console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
            var transaction = orderData.purchase_units[0].payments.captures[0];
            alert('Transaction '+ transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');

            // Replace the above to show a success message within this page, e.g.
            // const element = document.getElementById('paypal-button-container');
            // element.innerHTML = '';
            // element.innerHTML = '<h3>Thank you for your payment!</h3>';
            // Or go to another URL:  actions.redirect('thank_you.html');
        });
    }
}).render('#paypal-button-container');