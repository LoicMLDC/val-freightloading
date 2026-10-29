document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const error = document.getElementById('login-error');
  error.textContent = '';
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    }),
  });
  if (res.ok) {
    window.location.href = '/dashboard';
  } else {
    error.textContent = 'Invalid credentials';
  }
});
