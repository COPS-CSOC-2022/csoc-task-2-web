/***
 * @todo Redirect the user to login page if token is not present.
 */

 if(localStorage.getItem('Token')==null)
 window.location.href="/login/";