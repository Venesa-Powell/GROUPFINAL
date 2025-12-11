// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const TAX_RATE = 0.15;
const DISCOUNT_RATE = 0.10;

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    let totalAmount = 0;

    cart.forEach(item => {
        const subTotal = item.price * item.quantity; // constants for calculation 
        const discount = subTotal * DISCOUNT_RATE;
        const tax = (subTotal - discount) * TAX_RATE;
        const total = subTotal - discount + tax;
        totalAmount += total;
 // display items 
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input"></td>
            <td>$${subTotal.toFixed(2)}</td>
            <td>$${discount.toFixed(2)}</td>
            <td>$${tax.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
            <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    // Display total amount
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td colspan="6" style="text-align: right;"><strong>Total Amount:</strong></td>
        <td colspan="2"><strong>$${totalAmount.toFixed(2)}</strong></td>
    `;
    cartItemsContainer.appendChild(totalRow);

    // Update localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to update item quantity
function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = newQuantity;
    }
    renderCart();
}

// Function to remove item from cart
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

// Event listener for quantity change
document.addEventListener("input", (e) => {
    if (e.target.classList.contains("quantity-input")) {
        const productId = parseInt(e.target.dataset.id);
        const newQuantity = parseInt(e.target.value);
        updateQuantity(productId, newQuantity);
    }
});

// Event listener for remove button
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        const productId = parseInt(e.target.dataset.id);
        removeItem(productId);
    }
});

// Event listener for Clear All button
document.getElementById("clear-cart").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all items from the cart?")) {
        cart = [];
        localStorage.removeItem("cart");
        renderCart();
    }
});


// Event listener for Check Out button
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html"; // Redirect to the checkout page
});

// Event listener for Close button
document.getElementById("close-cart").addEventListener("click", () => {
    window.location.href = "products.html"; // Redirect to product page
});

// Initial render on page load
window.onload = renderCart;
