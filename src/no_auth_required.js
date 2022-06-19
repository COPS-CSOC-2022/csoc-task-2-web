/***
 * @todo Redirect the user to main page if token is present.
 */
 function noauthRequired (){
    const token = localStorage.getItem('token');
    if(token)
    {
        window.location.href = '/';
    }
}
   
noauthRequired(); 