/***
 * @todo Redirect the user to login page if token is not present.
 */
 var tokencheck=localStorage.getItem('token');
 if (!tokencheck) {
    window.location.href = '/login/';
}  
