if (!localStorage.getItem('isAuthenticated')) {
    window.location.href = 'admin/login.html';
}
document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'admin/login.html';
});