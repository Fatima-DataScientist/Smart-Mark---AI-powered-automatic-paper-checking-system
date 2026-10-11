document.querySelectorAll('.faq-question').forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    const isOpen = question.getAttribute('aria-expanded') === 'true';
    question.setAttribute('aria-expanded', String(!isOpen));
    answer.hidden = isOpen;
    item.classList.toggle('is-open', !isOpen);
    icon.textContent = isOpen ? '+' : '−';
  });
});
