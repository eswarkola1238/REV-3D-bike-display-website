(function () {
  const form = document.getElementById('login-form') || document.getElementById('signup-form');
  if (!form) return;

  const successNote = document.getElementById('success-note');

  function setError(fieldName, message) {
    const errEl = form.querySelector('.error[data-for="' + fieldName + '"]');
    const field = form.querySelector('[name="' + fieldName + '"]');
    const wrap = field ? field.closest('.field') : null;
    if (errEl) errEl.textContent = message || '';
    if (wrap) wrap.classList.toggle('invalid', !!message);
  }

  function validate() {
    let ok = true;

    if (form.querySelector('[name="name"]')) {
      const name = form.name.value.trim();
      if (name.length < 2) { setError('name', 'Enter your full name'); ok = false; }
      else setError('name', '');
    }

    const email = form.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { setError('email', 'Enter a valid email address'); ok = false; }
    else setError('email', '');

    const password = form.password.value;
    const minLen = form.password.getAttribute('minlength') || 6;
    if (password.length < minLen) { setError('password', 'Use at least ' + minLen + ' characters'); ok = false; }
    else setError('password', '');

    if (form.querySelector('[name="terms"]')) {
      if (!form.terms.checked) { setError('terms', 'You need to accept the terms to continue'); ok = false; }
      else setError('terms', '');
    }

    return ok;
  }

  form.querySelectorAll('input').forEach(function (input) {
    input.addEventListener('input', function () {
      const wrap = input.closest('.field');
      if (wrap && wrap.classList.contains('invalid')) {
        setError(input.name, '');
      }
    });
  });

  form.querySelectorAll('.pw-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const input = btn.previousElementSibling;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.textContent = showing ? 'Show' : 'Hide';
    });
  });

  const pwInput = form.querySelector('[name="password"]');
  const meterBar = document.getElementById('pw-meter-bar');
  if (pwInput && meterBar) {
    pwInput.addEventListener('input', function () {
      const v = pwInput.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      const pct = [0, 25, 50, 75, 100][score];
      const colors = ['#ff4d6d', '#ff4d6d', '#ff9f4d', '#34d8ff', '#ccff33'];
      meterBar.style.width = pct + '%';
      meterBar.style.background = colors[score];
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const label = submitBtn.querySelector('.btn-label');
    submitBtn.disabled = true;
    const originalText = label.textContent;
    label.textContent = 'Please wait…';

    setTimeout(function () {
      submitBtn.disabled = false;
      label.textContent = originalText;
      successNote.classList.add('show');
      successNote.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // mark as signed in (front-end demo only — no real backend)
      try {
        localStorage.setItem('rev_authed', 'true');
        localStorage.setItem('rev_user_email', form.email.value.trim());
      } catch (err) {}

      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      if (next) {
        const note = successNote.querySelector('p');
        if (note) note.textContent = 'Redirecting you now…';
        setTimeout(function () { window.location.href = next; }, 900);
      }
    }, 700);
  });
})();

// preserve ?next= across the login <-> signup cross-links
(function () {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  if (!next) return;
  document.querySelectorAll('a[href="login.html"], a[href="signup.html"]').forEach(function (a) {
    a.href = a.getAttribute('href') + '?next=' + encodeURIComponent(next);
  });
})();
