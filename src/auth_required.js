/***
 * @todo Redirect the user to login page if token is not present.
 */
checkTokenAuthReq();

function checkTokenAuthReq() {
    const token = localStorage.getItem("token");

    // if the token is empty, redirect
    if (!token) {
        window.location.href = "/login/"
    }
}