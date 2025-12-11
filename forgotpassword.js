const resetForm = document.getElementById('reset-password-form');
const resetError = document.getElementById('reset-error');
const resetSuccess = document.getElementById('reset-success');
const cancelButton = document.getElementById('cancel');

resetForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const trn = document.getElementById('trn').value.trim();
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        resetError.textContent = "Passwords do not match.";
        resetSuccess.textContent = "Password changed was successful"; // Clear success message
        return;
    }

    // Retrieve registration data from localStorage
    let registrationData = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    // Find user by trn
    const userIndex = registrationData.findIndex(user => user.trn === trn);

    if (userIndex === -1) {
        resetError.textContent = "trn not found.";
        resetSuccess.textContent = ""; // Clear success message
    } else {
        // Update the user's password
        registrationData[userIndex].password = newPassword;

        // Save updated data back to localStorage
        localStorage.setItem('RegistrationData', JSON.stringify(registrationData));

        resetSuccess.textContent = "Password reset successful!";
        resetError.textContent = ""; // Clear error message

        // Redirect to login page after a 3 seonds delay
        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000);
    }
});

// Clear form and messages on 'Cancel' button click
cancelButton.addEventListener('click', () => {
    resetForm.reset();
    resetError.textContent = '';
    resetSuccess.textContent = '';
});