/***
 * @todo Redirect the user to main page if token is present.
 */
 const token = window.localStorage.getItem('token');
 if(token){
     window.location.href ='/'
 }