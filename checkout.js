// --- Constants ---
const TAX_RATE = 0.15;
const DISCOUNT_RATE = 0.10;

// --- Load cart safely ---
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
} catch (err) {
    console.error("Error reading cart from localStorage:", err);
    cart = [];
}

// --- Load current user ---
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
if (!currentUser) {
    alert("You must be logged in to checkout.");
    window.location.href = "login.html";
}

// --- Render cart summary ---
function renderSummary() {
    const summaryItemsContainer = document.getElementById("summary-items");
    const totalAmountElement = document.getElementById("total-amount");
    if (!summaryItemsContainer || !totalAmountElement) return;

    summaryItemsContainer.innerHTML = "";
    let totalAmount = 0;

    cart.forEach(item => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const subTotal = price * quantity;
        const discount = subTotal * DISCOUNT_RATE;
        const tax = (subTotal - discount) * TAX_RATE;
        const total = subTotal - discount + tax;
        totalAmount += total;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name || "Unnamed Item"}</td>
            <td>$${price.toFixed(2)}</td>
            <td>${quantity}</td>
            <td>$${total.toFixed(2)}</td>
        `;
        summaryItemsContainer.appendChild(row);
    });

    totalAmountElement.innerText = totalAmount.toFixed(2);
}

// --- Input validation ---
function validateField(id, message) {
    const input = document.getElementById(id);
    const shippingError = document.getElementById("shipping-error");
    if (!input) return false;

    if (input.value.trim() === "") {
        shippingError.innerText = message;
        return false;
    } else {
        shippingError.innerText = "";
        return true;
    }
}

// Real-time validation
["name", "address", "amount-paid"].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener("input", () => {
            if (id === "name") validateField("name", "Full name is required.");
            if (id === "address") validateField("address", "Shipping address is required.");
            if (id === "amount-paid") validateField("amount-paid", "Amount paid is required.");
        });
    }
});

// --- Form submission: generate invoice ---
const shippingForm = document.getElementById("shipping-form");
if (shippingForm) {
    shippingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name")?.value.trim();
        const address = document.getElementById("address")?.value.trim();
        const amountPaid = parseFloat(document.getElementById("amount-paid")?.value);

        // Calculate totalAmount
        let totalAmount = 0;
        cart.forEach(item => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            const subTotal = price * quantity;
            const discount = subTotal * DISCOUNT_RATE;
            const tax = (subTotal - discount) * TAX_RATE;
            totalAmount += subTotal - discount + tax;
        });

        if (!name || !address || isNaN(amountPaid) || amountPaid < totalAmount) {
            alert("Please fill all fields and pay at least the total amount.");
            return;
        }

        // Create invoice
        const invoice = {
            invoiceNumber: "INV" + Date.now(),
            date: new Date().toLocaleDateString(),
            trn: currentUser.trn,    // use current user's TRN
            shipping: { name, address },
            items: cart.map(item => ({
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity)
            })),
            subtotal: totalAmount.toFixed(2),
            tax: (totalAmount * TAX_RATE).toFixed(2),
            total: (totalAmount * (1 + TAX_RATE)).toFixed(2)
        };

        // Save invoice to LatestInvoice for immediate display
        localStorage.setItem("LatestInvoice", JSON.stringify(invoice));

        // Save invoice to AllInvoices array
        let allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
        allInvoices.push(invoice);
        localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

        // Clear cart
        localStorage.removeItem("cart");

        // Redirect to invoice page
        window.location.href = "invoice.html";
    });
}

// --- Cancel button ---
const cancelBtn = document.getElementById("cancel-btn");
if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        shippingForm.reset();
        window.location.href = "cart.html";
    });
}

// --- Initialize ---
window.onload = renderSummary;









