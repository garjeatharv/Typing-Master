document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.color = '#ff4a4a';
  errorDiv.style.marginBottom = '15px';
  errorDiv.style.textAlign = 'center';
  errorDiv.style.fontWeight = 'bold';
  errorDiv.style.display = 'none';

  // Insert error element at the top of the form
  if (form) {
    form.insertBefore(errorDiv, form.firstChild);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset error state
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
      const originalBtnValue = submitBtn.value;
      submitBtn.value = 'Connecting...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, password })
        });

        const data = await response.json();

        if (data.success) {
          // Redirect to home page on successful authentication
          window.location.href = '/';
        } else {
          errorDiv.textContent = data.message || 'Invalid username or password';
          errorDiv.style.display = 'block';
          submitBtn.value = originalBtnValue;
          submitBtn.disabled = false;
        }
      } catch (err) {
        console.error('Login error:', err);
        errorDiv.textContent = 'Connection failed. Please check if server is running.';
        errorDiv.style.display = 'block';
        submitBtn.value = originalBtnValue;
        submitBtn.disabled = false;
      }
    });
  }
});
