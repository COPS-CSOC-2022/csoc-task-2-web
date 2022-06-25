/***
 * @todo Redirect the user to main page if token is present.
 */
checkTokenAuthNotReq();

function checkTokenAuthNotReq() {
    const token = localStorage.getItem("token");

    // if the token is not empty, redirect to main page
    if (token) {
        window.location.href = "/";
    }
}