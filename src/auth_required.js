/***
 * @todo Redirect the user to login page if token is not present.
 */

const userToken = localStorage.getItem('token');
if (userToken == null || userToken.length == 0 || userToken === undefined) {
    window.location.href = 'login/';
}