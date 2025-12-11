const registerForm = document.getElementById('register');
const registerError = document.getElementById('register-error');
const cancelButton = document.getElementById('cancel');

registerForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const trn = document.getElementById('trn').value.trim();
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // TRN format validation (000-000-000)
    const trnPattern = /^\d{3}-\d{3}-\d{3}$/;

    if (!trnPattern.test(trn)) {
        alert ( "TRN must be in the format 000-000-000 include hyphen.");
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert ("Passwords do not match.");
        return;
    }

    // Check if age is over 18
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (
        age < 18 ||
        (age === 18 && today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()))
    ) {
        alert ("You must be at least 18 years old to register.");
        return;
    }

    // Retrieve existing registrations from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    // Check if TRN already exists (username check)
    const trnExists = existingUsers.some(user => user.trn === trn);

    if (trnExists) {
        alert ("This TRN is already registered.");
        return;
    }

    // Create new user object
    const newUser = {
        firstName,
        lastName,
        dob,
        gender,
        phone,
        email,
        trn,       // ← TRN used as username
        password,
        dateOfRegistration: new Date().toISOString(),
        cart: {},
        shipdetails: []
    };

    // Save new user
    existingUsers.push(newUser);
    localStorage.setItem('RegistrationData', JSON.stringify(existingUsers));

    // Success message
    registerError.style.color = "green";
    alert( "Registration successful! Redirecting to homepage within 3 seconds");

    // Redirect to homepage
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
});


    // Cancel button clears form
    cancelButton.addEventListener('click', () => {
        registerForm.reset();
        registerError.textContent = "";
        registerError.style.color = "red";
    });

