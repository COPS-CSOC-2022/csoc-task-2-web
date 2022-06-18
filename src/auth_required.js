/***
 * @todo Redirect the user to login page if token is not present.
 */
 function login_required(){
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = '/login/'
    }
 }
 login_required()