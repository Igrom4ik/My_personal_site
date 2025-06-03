const form = document.getElementById('change-form');
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/change_credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            throw new Error('Change failed');
        }
        localStorage.setItem('token', token);
        window.location.href = '../dashboard.html';
    } catch (e) {
        errorMessage.style.display = 'block';
    }
});
