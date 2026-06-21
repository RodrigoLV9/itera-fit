(function () {
  var modal = document.getElementById('modal');
  var overlay = modal.querySelector('.modal__overlay');
  var closeBtn = modal.querySelector('.modal__close');
  var form = document.getElementById('evaluationForm');
  var formView = document.getElementById('formView');
  var successView = document.getElementById('successView');
  var formError = document.getElementById('formError');
  var successMessage = document.getElementById('successMessage');
  var heroCta = document.querySelector('.hero__cta');

  function openModal(e) {
    if (e) e.preventDefault();
    showFormView();
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showFormView() {
    formView.classList.remove('modal__view--hidden');
    successView.classList.add('modal__view--hidden');
    formError.classList.remove('modal__error--visible');
    form.reset();
    var errorFields = formView.querySelectorAll('.modal__field--error');
    for (var i = 0; i < errorFields.length; i++) {
      errorFields[i].classList.remove('modal__field--error');
    }
  }

  function showSuccessView(name) {
    formView.classList.add('modal__view--hidden');
    successView.classList.remove('modal__view--hidden');
    successMessage.textContent = 'Gracias, ' + name + '. Nos pondremos en contacto pronto para coordinar tu evaluación.';
  }

  function validateField(field) {
    var input = field.querySelector('input, select, textarea');
    if (!input) return true;
    var val = input.value.trim();
    if (input.tagName === 'SELECT') {
      return val !== '';
    }
    if (val === '') return false;
    if (input.id === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }
    if (input.id === 'phone') {
      return /^[\d\s\-+()]{7,20}$/.test(val) && /\d{7,}/.test(val.replace(/\D/g, ''));
    }
    return true;
  }

  function showFieldError(field) {
    field.classList.add('modal__field--error');
  }

  function clearFieldError(field) {
    field.classList.remove('modal__field--error');
  }

  heroCta.addEventListener('click', openModal);

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  var requiredFields = ['name', 'email', 'phone'];
  var fieldSelectors = [];
  for (var i = 0; i < requiredFields.length; i++) {
    var input = document.getElementById(requiredFields[i]);
    var field = input.closest('.modal__field');
    fieldSelectors.push(field);
  }

  for (var i = 0; i < fieldSelectors.length; i++) {
    (function (field) {
      var input = field.querySelector('input');
      if (input) {
        input.addEventListener('input', function () {
          if (validateField(field)) {
            clearFieldError(field);
            formError.classList.remove('modal__error--visible');
          }
        });
      }
    })(fieldSelectors[i]);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var hasErrors = false;
    for (var i = 0; i < fieldSelectors.length; i++) {
      if (!validateField(fieldSelectors[i])) {
        showFieldError(fieldSelectors[i]);
        hasErrors = true;
      } else {
        clearFieldError(fieldSelectors[i]);
      }
    }

    if (hasErrors) {
      formError.classList.add('modal__error--visible');
      formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    formError.classList.remove('modal__error--visible');

    var name = document.getElementById('name').value.trim();
    showSuccessView(name);
  });
})();
