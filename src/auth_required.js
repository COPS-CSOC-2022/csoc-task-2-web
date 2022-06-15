/***
 * @todo Redirect the user to login page if token is not present.
 */
function authReq () {
    const token = localStorage.getItem('token');
    if(!token)
    {
        window.location.href = '/login/';
    }
}

authReq();