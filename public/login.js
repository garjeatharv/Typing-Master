document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form') || document.querySelector('form');
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

    const submitBtn = form.querySelector('input[type="submit"]');
    const original = submitBtn.value;
    submitBtn.value = 'Connecting…';
    submitBtn.disabled = true;

    try {
      await TM.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ name, password }),
      });
      window.location.href = '/';
    } catch (err) {
      errorDiv.textContent = err.message || 'Invalid username or password';
      errorDiv.style.display = 'block';
      submitBtn.value = original;
      submitBtn.disabled = false;
    }
  });
});
