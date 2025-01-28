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
window.onload = function () {
    console.log("Page loaded. Generating product divs..."); // Debugging
    updateCart();

    const productContainer = document.getElementById("productContainer");
    if (productContainer) {
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.id = `p${product.id}`;
            productDiv.style.display = "none"; // Start with all products hidden
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button class="remove-button" onclick="removeItem(${product.price}, ${product.id})">Remove</button>
                </div>
            `;
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