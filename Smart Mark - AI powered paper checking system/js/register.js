const registerForm = document.getElementById('register-form');

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fullName = document.getElementById('fullname').value.trim();
    const password = document.getElementById('password').value;
    const confirmation = document.getElementById('confirm').value;

    if (password !== confirmation) {
      window.alert('Passwords do not match. Please try again.');
      return;
    }

    // This deployed version is a front-end demo. Store the demo session so the
    // dashboard recognises the new user until real FastAPI authentication is added.
    localStorage.setItem('smartmark-demo-session', 'active');
    localStorage.setItem('smartmark-demo-name', fullName || 'SmartMark Teacher');
    window.location.assign('dashboard.html');
  });
}
