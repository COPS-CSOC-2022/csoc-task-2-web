/***
 * @todo Redirect the user to login page if token is not present.
 */

 if (!localStorage.token) {
    window.location.href = 'login/';
} 