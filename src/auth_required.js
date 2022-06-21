// redirecting to login page

if(localStorage.token == undefined) {
    window.location.href = '/login/';
} 