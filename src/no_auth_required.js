/***
 * @todo Redirect the user to main page if token is present.
 */

 import axios from 'axios';

 const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
 
 if(localStorage.getItem('token'))
 {
     window.location.href = '/'
     console.log("NO authorisation req");
 }
 