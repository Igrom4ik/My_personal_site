if (!localStorage.getItem('token')) {
    window.location.href = 'admin/login.html';
}

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'admin/login.html';
});
