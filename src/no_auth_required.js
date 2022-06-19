/***
 * @todo Redirect the user to main page if token is present.
 */

 import axios from 'axios';
 
 if(localStorage.getItem('token'))
 {
     window.location.href = '/'
     console.log("NO authorisation req");
 }
 