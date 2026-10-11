if(localStorage.getItem('smartmark-demo-session')!=='active')window.location.replace('login.html');document.querySelector('[data-logout]').onclick=()=>{localStorage.clear();location.href='smartmark-landing-page%20(2).html'};let z=1,r=0;const sheet=document.getElementById('sheet'),toast=document.querySelector('.toast');document.getElementById('zoom').onclick=()=>{z=z===1?1.1:1;sheet.style.transform=`scale(${z}) rotate(${r}deg)`};document.getElementById('rotate').onclick=()=>{r=(r+90)%360;sheet.style.transform=`scale(${z}) rotate(${r}deg)`};document.getElementById('save').onclick=()=>{toast.textContent='OCR changes saved.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)};

const nextStudentLink = document.querySelector('.review nav a');
nextStudentLink.textContent = 'Save & next student →';
nextStudentLink.href = 'grade-review.html';

const ocrCreateLink = document.querySelector('aside a[href="create-exam.html"]');
ocrCreateLink.insertAdjacentHTML('afterend', '<a href="#">▥ Analytics</a><a href="export-reports.html">▣ Report Cards</a>');
