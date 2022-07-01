const auth = function() {
    if(!localStorage.getItem('token'))
        window.location.href = '/login/';
}

auth();