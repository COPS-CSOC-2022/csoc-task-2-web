/***
 * @todo Redirect the user to main page if token is present.
 */
 function redirectMain () {
    const token = localStorage.getItem('token');
    if(token)
    {
        window.location.href = '/';
    }
}

redirectMain(); 