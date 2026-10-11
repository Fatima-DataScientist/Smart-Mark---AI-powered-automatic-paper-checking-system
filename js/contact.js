const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = 'Thanks for your message! We will get back to you soon.';
    contactForm.reset();
  });
}
