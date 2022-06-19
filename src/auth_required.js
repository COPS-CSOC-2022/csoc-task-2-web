/***
 * @todo Redirect the user to login page if token is not present.
 */
import axios from 'axios';

if(!localStorage.getItem('token'))
{
    window.location.href = '/login/';
    console.log("Authorisation required");
}
