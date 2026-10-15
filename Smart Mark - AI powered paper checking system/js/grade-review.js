if(localStorage.getItem('smartmark-demo-session')!=='active')window.location.replace('login.html');document.querySelector('[data-logout]').onclick=()=>{localStorage.clear();location.href='login.html'};const total=document.getElementById('total'),toast=document.querySelector('.toast');const update=()=>total.textContent=[...document.querySelectorAll('[data-mark]')].reduce((n,s)=>n+Number(s.value),0);document.querySelectorAll('[data-mark]').forEach(s=>s.onchange=update);document.getElementById('save').onclick=()=>{toast.textContent=`Final grade of ${total.textContent}/15 saved.`;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)};update();

document.getElementById('save').addEventListener('click', () => {
  localStorage.setItem('smartmark-final-score', total.textContent);
  window.location.href = 'student-result.html';
});

const gradeCreateLink = document.querySelector('aside a[href="create-exam.html"]');
gradeCreateLink.insertAdjacentHTML('afterend', '<a href="#">▥ Analytics</a><a href="export-reports.html">▣ Report Cards</a>');
