const form = document.getElementById('login-form');
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';

    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const err = new Error('Auth failed');
            err.status = response.status;
            throw err;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        if (data.must_change) {
            window.location.href = 'change-credentials.html';
        } else {
            window.location.href = '../dashboard.html';
        }
    } catch (e) {
        if (e.status === 401) {
            errorMessage.textContent = 'Неверное имя пользователя или пароль';
        } else {
            errorMessage.textContent = 'Не удалось подключиться к серверу';
        }
        errorMessage.style.display = 'block';
    }
});
