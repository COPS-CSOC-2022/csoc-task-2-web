/***
 * @todo Redirect the user to main page if token is present.
 */


// taking token from local storage
 const token = localStorage.getItem('token');


 // if token is  there then redirect the user to home page
 if( token !=null)
 {
     window.location.href="/";
 }



