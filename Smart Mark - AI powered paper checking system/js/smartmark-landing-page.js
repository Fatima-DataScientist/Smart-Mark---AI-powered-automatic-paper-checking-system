document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const sessionKey = 'smartmark-demo-session';
function openWorkspace() {
  window.location.href = localStorage.getItem(sessionKey) === 'active' ? 'dashboard.html' : 'login.html';
}

document.querySelectorAll('[data-workspace-link]').forEach((button) => {
  button.addEventListener('click', openWorkspace);
});
