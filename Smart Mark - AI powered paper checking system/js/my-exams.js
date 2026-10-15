if(localStorage.getItem('smartmark-demo-session')!=='active')window.location.replace('login.html');
document.querySelector('[data-logout]').addEventListener('click',()=>{localStorage.removeItem('smartmark-demo-session');localStorage.removeItem('smartmark-demo-name');window.location.href='login.html';});
const toast=document.querySelector('.toast');let timer;document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.action==='Review flagged sheets'||button.dataset.action==='View report cards')return;toast.textContent=`${button.dataset.action} is ready for the next build step.`;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),3000);}));

document.querySelector('[data-action="Review flagged sheets"]').addEventListener('click', () => {
  window.location.href = 'ocr-review.html';
});

document.querySelector('[data-action="View report cards"]').addEventListener('click', () => {
  window.location.href = 'export-reports.html';
});

document.querySelectorAll('.nav-item').forEach((item) => {
  if (item.textContent.includes('Report Cards')) item.href = 'export-reports.html';
});
