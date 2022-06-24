/***
 * @todo Redirect the user to login page if token is not present.
 */
 if(!window.localStorage.getItem('token'))
 window.location.href = '/login/'
