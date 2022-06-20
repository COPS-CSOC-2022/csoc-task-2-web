/***
 * @todo Redirect the user to main page if token is present.
 */
 var tokencheck=localStorage.getItem('token');
 if (tokencheck) {
    window.location.href = '/';
}  
