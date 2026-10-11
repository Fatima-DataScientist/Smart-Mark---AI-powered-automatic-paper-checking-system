// Preserve the login protection while the dashboard is a static front-end demo.
if (localStorage.getItem('smartmark-demo-session') !== 'active') {
  window.location.replace('login.html');
}

document.getElementById('logout-button').addEventListener('click', () => {
  localStorage.removeItem('smartmark-demo-session');
  localStorage.removeItem('smartmark-demo-name');
  window.location.href = 'smartmark-landing-page%20(2).html';
});
