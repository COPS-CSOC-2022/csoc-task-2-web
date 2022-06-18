/***
 * @todo Redirect the user to login page if token is not present.
 */
 function redirectLogin () {
    const token = localStorage.getItem('token');
    if(!token)
    {
        window.location.href = '/login/';
    }
}

redirectLogin(); 