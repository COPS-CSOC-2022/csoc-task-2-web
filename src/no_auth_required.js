/***
 * @todo Redirect the user to main page if token is present.
 */

 const token = localStorage.getItem('token');

 if( token !=null)
 {
     window.location.href="/";
 }



