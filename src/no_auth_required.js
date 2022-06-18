/***
 * @todo Redirect the user to main page if token is present.
 */

 function nologin_required(){
    const token = localStorage.getItem('token');
    if(token){
        window.location.href = '/'
    }
 }
 nologin_required()