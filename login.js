const loginForm = document.getElementById('PC-login-form');
const cancelButton = document.getElementById('cancel');
const errorMessage = document.getElementById('error-message');
let loginAttempts = 0;

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const trn = document.getElementById('trn').value.trim();
    const password = document.getElementById('password').value;

    // Retrieve registered users from localStorage
    const registrationData = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    // Validate trn and password
    const user = registrationData.find(user => user.trn === trn && user.password === password);

    if (user) {
        // Store full user object in localStorage as currentUser
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Successful login redirect to product catalog
        window.location.href = "products.html";
    } else {
        // If login fails
        loginAttempts++;
        errorMessage.textContent = `Invalid TRN or password. Attempt ${loginAttempts} of 3.`;

        // Redirect to error page if maximum attempts reached
        if (loginAttempts >= 3) {
            window.location.href = "error.html";
        }
    }
});

// Clear form on 'Cancel' button click
cancelButton.addEventListener('click', () => {
    loginForm.reset();
    errorMessage.textContent = ''; // Clear any error messages
});
