const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('email').value.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    localStorage.setItem('smartmark-demo-session', 'active');
    localStorage.setItem('smartmark-demo-name', name || 'SmartMark Teacher');
    window.location.href = 'dashboard.html';
  });
}
