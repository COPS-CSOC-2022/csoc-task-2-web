/***
 * @todo Redirect the user to main page if token is present.
 */
 const userToken = localStorage.getItem('token');
if (userToken != null && userToken.length > 0) {
    window.location.href = "/";
}
