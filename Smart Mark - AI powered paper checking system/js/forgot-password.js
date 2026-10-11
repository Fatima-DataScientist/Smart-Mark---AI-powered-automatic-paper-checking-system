const requestView = document.getElementById('requestView');
const successView = document.getElementById('successView');
const emailInput = document.getElementById('email');
const emailDisplay = document.getElementById('emailDisplay');
const resetForm = document.getElementById('forgot-password-form');
const resendLink = document.getElementById('resend-link');

if (resetForm) {
  resetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    emailDisplay.textContent = emailInput.value || 'your email';
    requestView.style.display = 'none';
    successView.style.display = 'block';
  });
}

if (resendLink) {
  resendLink.addEventListener('click', (event) => {
    event.preventDefault();
    successView.style.display = 'none';
    requestView.style.display = 'block';
    emailInput.focus();
  });
}
