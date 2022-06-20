const no_auth = function() {
    if(localStorage.getItem('token'))
        window.location.href = '/';
}

no_auth();