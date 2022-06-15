/***
 * @todo Redirect the user to main page if token is present.
 */

 function noAuthReq () {
    const token = localStorage.getItem('token');
    if(token)
    {
        window.location.href = '/';
    }
}

noAuthReq();