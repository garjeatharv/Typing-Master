document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form') || document.querySelector('form');
  if (!form) return;

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.display = 'none';
  form.insertBefore(errorDiv, form.firstChild);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    const name = form.name.value.trim();
    const password = form.password.value;

    if (!name || !password) {
      errorDiv.textContent = 'Please fill in all fields';
      errorDiv.style.display = 'block';
      return;
    }

    if (name.length < 2) {
      errorDiv.textContent = 'Username must be at least 2 characters';
      errorDiv.style.display = 'block';
      return;
    }

    if (password.length < 4) {
      errorDiv.textContent = 'Password must be at least 4 characters';
      errorDiv.style.display = 'block';
      return;
    }

    const submitBtn = form.querySelector('input[type="submit"]');
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    try {
      await TM.request('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, password }),
      });
      window.location.href = '/';
    } catch (err) {
      errorDiv.textContent = err.message || 'Signup failed';
      errorDiv.style.display = 'block';
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
});
