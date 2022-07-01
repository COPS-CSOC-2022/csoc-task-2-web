/***
 * @todo Redirect the user to main page if token is present.
 */
 if(localStorage.token != null || localStorage.token != undefined){
    window.location.href = '/'
}