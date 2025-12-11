

/* function that displays user frequency and pie charts*/
function ShowUserFrequency() {
    // Retrieve users from localStorage or set to empty array if none exist
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    // Gender counters
    let male = 0;
    let female = 0;

    // Age group counters
    let age18_25 = 0;
    let age26_35 = 0;
    let age36_50 = 0;
    let age50plus = 0;

    // Loop through each user to count gender and age groups
    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // Count gender
        const genderLower = (user.gender || "").toLowerCase();
        if (genderLower === "male") {
            male++;
        } else if (genderLower === "female") {
            female++;
        }

        // Calculate age from date of birth
        const birthDate = new Date(user.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        
        // Adjust age if birthday hasn't occurred yet this year
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Count age groups based on calculated age
        if (age >= 18 && age <= 25) {
            age18_25++;
        } else if (age >= 26 && age <= 35) {
            age26_35++;
        } else if (age >= 36 && age <= 50) {
            age36_50++;
        } else if (age > 50) {
            age50plus++;
        }
    }

    // Update Gender Table
    document.getElementById("male-count").innerText = male;
    document.getElementById("female-count").innerText = female;

    // Update Age Group Table
    document.getElementById("age-18-25").innerText = age18_25;
    document.getElementById("age-26-35").innerText = age26_35;
    document.getElementById("age-36-50").innerText = age36_50;
    document.getElementById("age-50plus").innerText = age50plus;

    // Calculate totals for pie charts
    const totalGender = male + female || 1; // Prevent division by zero
    const totalAge = age18_25 + age26_35 + age36_50 + age50plus || 1;

    // Update Gender Pie Charts
    // Calculate degrees for pie chart (360 degrees = 100%)
    const maleDeg = (male / totalGender) * 360;
    const femaleDeg = (female / totalGender) * 360;

    // Male pie - filled portion shows male percentage
    document.getElementById("male-pie").style.background = 
        `conic-gradient(rgb(75, 75, 240) 0deg, rgb(75, 75, 240) ${maleDeg}deg, #ddd ${maleDeg}deg, #ddd 360deg)`;
    
    // Female pie - filled portion shows female percentage
    document.getElementById("female-pie").style.background = 
        `conic-gradient(rgb(133, 201, 228) 0deg, rgb(133, 201, 228) ${femaleDeg}deg, #ddd ${femaleDeg}deg, #ddd 360deg)`;

    // Update Age Group Pie Chart (combined pie showing all 4 age groups)
    // Calculate degrees for each segment
    const age1Deg = (age18_25 / totalAge) * 360;
    const age2Deg = age1Deg + (age26_35 / totalAge) * 360;
    const age3Deg = age2Deg + (age36_50 / totalAge) * 360;
    const age4Deg = 360; // Remaining goes to 50+

    // Create combined pie chart with 4 segments
    document.getElementById("age-pie").style.background = 
        `conic-gradient(
            rgb(75, 75, 240) 0deg, 
            rgb(75, 75, 240) ${age1Deg}deg, 
            rgb(133, 201, 228) ${age1Deg}deg, 
            rgb(133, 201, 228) ${age2Deg}deg, 
            rgb(100, 180, 100) ${age2Deg}deg, 
            rgb(100, 180, 100) ${age3Deg}deg, 
            rgb(240, 180, 75) ${age3Deg}deg, 
            rgb(240, 180, 75) ${age4Deg}deg
        )`;

    // Log frequency data to console
    console.log("=== User Frequency Report ===");
    console.log("Total Registered Users: " + users.length);
    console.log("");
    console.log("Gender Distribution:");
    console.log("  Male: " + male);
    console.log("  Female: " + female);
    console.log("");
    console.log("Age Group Distribution:");
    console.log("  18-25: " + age18_25);
    console.log("  26-35: " + age26_35);
    console.log("  36-50: " + age36_50);
    console.log("  50+: " + age50plus);
    console.log("=============================");
}


/* function that displays all invoices from local sotorage and user invoice box */
function ShowInvoices() {
    // Retrieve all invoices from localStorage
    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    
    // Get the results container
    const resultsContainer = document.getElementById("invoice-results");
    
    // Log all invoices to console as required
    console.log("=== All Invoices (AllInvoices from localStorage) ===");
    console.log("Total Invoices: " + allInvoices.length);
    console.log("");

    if (allInvoices.length === 0) {
        resultsContainer.innerHTML = "<p>No invoices found in the system.</p>";
        console.log("No invoices found in localStorage.");
        console.log("==========================================");
        return;
    }

    // Build HTML to display all invoices
    let html = "";

    // Loop through each invoice and display it
    for (let i = 0; i < allInvoices.length; i++) {
        const invoice = allInvoices[i];
        
        let itemList = "";
        if (invoice.items && Array.isArray(invoice.items)) { //array is checked to see if items exist
            invoice.items.forEach(item => {
                itemList += item.name + " (x" + item.quantity + "), ";
            });
            itemList = itemList.slice(0, -2); // Remove trailing comma
        }

        html += "<div style='border-bottom: 1px solid #ccc; padding: 8px 0;'>";
        html += "<strong>Invoice #:</strong> " + invoice.invoiceNumber + " | ";
        html += "<strong>TRN:</strong> " + invoice.trn + " | ";
        html += "<strong>Date:</strong> " + invoice.date + " | ";
        html += "<strong>Total:</strong> $" + invoice.total;
        html += "</div>";

        // Log each invoice to console
        console.log("Invoice #" + (i + 1) + ":");
        console.log("  Invoice Number: " + invoice.invoiceNumber);
        console.log("  Date: " + invoice.date);
        console.log("  TRN: " + invoice.trn);
        console.log("  Customer: " + (invoice.shipping?.name || "N/A"));
        console.log("  Address: " + (invoice.shipping?.address || "N/A"));
        console.log("  Items: " + itemList);
        console.log("  Subtotal: $" + invoice.subtotal);
        console.log("  Tax: $" + invoice.tax);
        console.log("  Total: $" + invoice.total);
        console.log("  ---");
    }

    resultsContainer.innerHTML = html;
    console.log("==========================================");
}


/* function that displays all the invoices for user TRN*/
function GetUserInvoices() {
    // Get the TRN entered in the search box
    const searchTRN = document.getElementById("trn-search").value.trim();
    
    // Get the results container
    const resultsContainer = document.getElementById("invoice-results");
    
    // Validate that TRN is entered
    if (searchTRN === "") {
        resultsContainer.innerHTML = "<p style='color: red;'>Please enter a TRN to search.</p>";
        return;
    }

    // Retrieve all invoices from localStorage
    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    
    // Retrieve registration data to get user info
    const registrationData = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    
    // Check if the TRN exists in registration data
    const userExists = registrationData.find(user => user.trn === searchTRN);

    // Log search operation to console
    console.log("=== Searching Invoices by TRN ===");
    console.log("Search TRN: " + searchTRN);
    console.log("User Found in RegistrationData: " + (userExists ? "Yes" : "No"));
    
    if (userExists) {
        console.log("User Details:");
        console.log("  Name: " + userExists.firstName + " " + userExists.lastName);
        console.log("  Email: " + userExists.email);
    }
    console.log("");

    // Filter invoices by the entered TRN
    const userInvoices = allInvoices.filter(invoice => invoice.trn === searchTRN);

    // Check if any invoices were found
    if (userInvoices.length === 0) {
        resultsContainer.innerHTML = "<p>No invoices found for TRN: " + searchTRN + "</p>";
        console.log("No invoices found for TRN: " + searchTRN);
        console.log("=================================");
        return;
    }

    // Build HTML to display invoices
    let html = "<p><strong>Found " + userInvoices.length + " invoice(s) for TRN: " + searchTRN + "</strong></p>";
    
    for (let i = 0; i < userInvoices.length; i++) {
        const invoice = userInvoices[i];
        
        let itemList = "";
        if (invoice.items && Array.isArray(invoice.items)) {
            invoice.items.forEach(item => {
                itemList += item.name + " (x" + item.quantity + "), ";
            });
            itemList = itemList.slice(0, -2);
        }

        html += "<div style='border-bottom: 1px solid #ccc; padding: 8px 0;'>";
        html += "<strong>Invoice #:</strong> " + invoice.invoiceNumber + "<br>";
        html += "<strong>Date:</strong> " + invoice.date + "<br>";
        html += "<strong>Items:</strong> " + itemList + "<br>";
        html += "<strong>Total:</strong> $" + invoice.total;
        html += "</div>";

        // Log to console
        console.log("Invoice #" + (i + 1) + ":");
        console.log("  Invoice Number: " + invoice.invoiceNumber);
        console.log("  Date: " + invoice.date);
        console.log("  Items: " + itemList);
        console.log("  Total: $" + invoice.total);
        console.log("  ---");
    }

    resultsContainer.innerHTML = html;
    
    console.log("Found " + userInvoices.length + " invoice(s) for TRN: " + searchTRN);
    console.log("=================================");
}


/* Function that clears the TRN enetered and also the invoice results display */
function clearSearch() {
    // Clear the search input
    document.getElementById("trn-search").value = "";
    
    // Clear the results display
    document.getElementById("invoice-results").innerHTML = "";
    
    console.log("Search cleared.");
}


/* Event Listeners */
document.addEventListener("DOMContentLoaded", function() {
    // Call ShowUserFrequency when page loads to display user statistics
    ShowUserFrequency();
    
    // Add event listener for Search button
    document.getElementById("search-btn").addEventListener("click", GetUserInvoices);
    
    // Add event listener for Show All Invoices button
    document.getElementById("show-all-btn").addEventListener("click", ShowInvoices);
    
    // Add event listener for Clear button
    document.getElementById("clear-btn").addEventListener("click", clearSearch);
    
    // Add event listener for Enter key on search input
    document.getElementById("trn-search").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            GetUserInvoices();
        }
    });
});
