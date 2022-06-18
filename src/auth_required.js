/***
 * @todo Redirect the user to login page if token is not present.
 */
import axios from 'axios';

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

if(!localStorage.getItem('token'))
{
    window.location.href = '/login/';
    console.log("Authorisation required");
}
