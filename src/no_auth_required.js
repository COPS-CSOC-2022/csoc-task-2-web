/***
 * @todo Redirect the user to main page if token is present.
 */

if (localStorage.getItem('token') != null) {
    window.location.replace(window.location.href.slice(0, -6))
}