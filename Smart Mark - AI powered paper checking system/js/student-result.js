if(localStorage.getItem('smartmark-demo-session')!=='active')window.location.replace('login.html');document.querySelector('[data-logout]').onclick=()=>{localStorage.clear();location.href='smartmark-landing-page%20(2).html'};const saved=localStorage.getItem('smartmark-final-score');if(saved)document.getElementById('score').innerHTML=`${saved}<span>/15</span>`;document.getElementById('print').onclick=()=>window.print();

const backToExamsLink = document.querySelector('header > a');
window.addEventListener('beforeprint', () => { backToExamsLink.hidden = true; });
window.addEventListener('afterprint', () => { backToExamsLink.hidden = false; });

const resultCreateLink = document.querySelector('aside a[href="create-exam.html"]');
resultCreateLink.insertAdjacentHTML('afterend', '<a href="#">▥ Analytics</a><a href="export-reports.html">▣ Report Cards</a>');
