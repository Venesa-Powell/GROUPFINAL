// Array of product objects
const products = [
    { id: 1, name: "Byzen 5  5700X CPU", price: 150, description: " 6 Core 12 Threads Base speed: (3.6 Ghz) Max speed:(4.6 GHZ)", image: "pics/cpu/ryzen5.jpg" },
    { id: 2, name: "Byzen 5  6700X CPU", price: 200, description: "6 Core 12 Threads Base speed: (3.9 Ghz) Max speed:(4.9 GHZ)", image: "pics/cpu/ryzen51.jpg" },
    { id: 3, name: "Byzen 7  7700X CPU", price: 250, description: "8 Core 16 Threads Base speed: (3.9 Ghz) Max speed:(5.3 GHZ)", image: "pics/cpu/ryzen7.jpg" },
    
    { id: 4, name: "Dvidia 5070ti GPU ", price: 700, description: "16GB(VRAM), Boost Speed: 2640 MHz, PCIe® 5.0  ", image: "pics/gpu/5070ti.jpg" },
    { id: 5, name: "GMD 9070xt", price: 600, description: "16GB(VRAM), Boost Speed: 2840 MHz, PCIe® 5.0", image: "pics/gpu/9070xt.jpg" },
    { id: 6, name: "Antel b580", price: 400, description: "12GB(VRAM), Boost Speed: 2240 MHz, PCIe® 5.0", image: "pics/gpu/b580.jpg" },

    { id: 7, name: "XSAIR DDR5 RAM", price: 170, description: "32GB Kit (2x16GB), 6400MHz", image: "pics/ram/corsair.jpg" },
    { id: 8, name: "CRITS DDR5 RAM", price: 150, description: "32GB Kit (2x16GB), 6000MHz ", image: "pics/ram/crucial.jpg" },
    { id: 9, name: "FURY DDR5 RAM", price: 120, description: "16GB Kit (2x8GB), 6400MHz", image: "pics/ram/kingston.jpg" },

    { id: 10, name: "GIGA ZB650 Motherboard ", price: 140, description: "Supports Byzen 5000,6000 & 7000 series  PCIe 5.0, 2 M.2 slots Micro-ATX motherboard", image: "pics/motherboard/b650-asus.jpg" },
    { id: 11, name: "ISUS ZB650 Motherboard", price: 160, description: "Supports Byzen 5000,6000 & 7000 series  PCIe 5.0, 3 M.2 slots ATX motherboard", image: "pics/motherboard/b650-gigabyte.jpg"},
    { id: 12, name: "DSI ZB650 Motherboard", price: 210, description: "Supports Byzen 5000,6000 & 7000 series  PCIe 5.0, 1 M.2 slots Mini-ITX motherboard", image: "pics/motherboard/b650-msi.jpg" }
];

// Save the product list to localStorage
localStorage.setItem("AllProducts", JSON.stringify(products));

// Cart array for managing selected items
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to display products
function displayProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description} <br> Price: $${product.price}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });

    // Add event listeners for Add to Cart buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}

// Function to add product to cart
function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Update cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Function to remove product from cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
    }

    // Update cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Function to render the cart items
function renderCart() {
    const cartItemsElement = document.getElementById("cart-items");
    cartItemsElement.innerHTML = "";

    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${item.name} - $${item.price} (Quantity: ${item.quantity}) 
            <button class="remove-from-cart" data-id="${item.id}">Remove</button>
        `;
        cartItemsElement.appendChild(listItem);
    });

    // Event listeners for Remove buttons
    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Event listener for the checkout button
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Save the cart to localStorage for retrieval on the cart page
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "cart.html";
});

// Load cart from localStorage on page load
window.onload = function () {
    renderCart();
    displayProducts();
};

// Event listener for the logout button
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("cart"); // Clear cart 
    window.location.href = "index.html";
});