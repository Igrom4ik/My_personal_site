document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    // Пример проверки (замените на серверную авторизацию в продакшене)
    if (username === 'admin' && password === 'password123') {
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '../dashboard.html';
    } else {
        errorMessage.style.display = 'block';
    }
});