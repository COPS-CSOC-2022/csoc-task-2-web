
// taking token from local storage
const token = localStorage.getItem('token');


// if token is not there then redirect the user to login page 
if(!token)
{
    window.location.href = '/login/';
}


