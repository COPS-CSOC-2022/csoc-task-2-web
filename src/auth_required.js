/***
 * @todo Redirect the user to login page if token is not present.
 */
 if (localStorage.getItem('token') == null|| localStorage.token == undefined) {
    window.location.href = (`${window.location.href}login/`)
}
