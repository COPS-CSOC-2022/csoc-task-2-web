import axios from 'axios';


function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

let loginBtn = document.getElementById('loginbtn');
if(loginBtn!=null){
    loginBtn.addEventListener('click', login);
}   

let registerBtn = document.getElementById('registerBtn');
if(registerBtn!=null){ 
    registerBtn.addEventListener('click', register);
}

let logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn != null){
    logoutBtn.addEventListener('click', logout);
}

let addTaskBtn = document.getElementById('addTaskBtn');
if(addTaskBtn != null){
    addTaskBtn.addEventListener('click', addTask);
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
}

function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    console.log('running outside');
    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }
        console.log('im running')
        axios({
            url: API_BASE_URL + 'auth/register/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend, login and direct user to home page.
     */
    let username = document.getElementById('inputUsername').value.trim();
    let password = document.getElementById('inputPassword').value;
    if(username!='' && password!=''){

        fetch(API_BASE_URL+'auth/login/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                'username': username,
                'password': password
            }),
        })
        .then(response => response.json())
        .then(function(data){
            console.log(data);
            console.log(data.token);
            if(data.token == null){
                displayErrorToast('invalid credentials');
            }else{
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            }
        })
        .catch(function(err){displayErrorToast('wrong credentials')})    
    }else{
        displayErrorToast('fields cannot be empty');
    }
    


}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    let task = document.getElementById('inpTask').value.trim();
    if(task!=null){
        fetch(API_BASE_URL+'todo/create/',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Token ${localStorage.token}`,  
            },
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                'title': task
            }),
        })
        .then(function(response){
            document.querySelector('.form-control').value = "";
            document.querySelector('.form-control').placeholder = "Enter Task";
            getTasks();
        })
        
        .catch(err => console.log(err))
    }

}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */

    axios({
        url: API_BASE_URL+`todo/${id}/`,
        method: 'DELETE',
        data: {id: id},
        headers: { Authorization : `token ${localStorage.token}`}
    }).then(function(res, stat){
        getTasks();
    })


    

}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */

    let updatedTitle = document.getElementById(`input-button-${id}`).value.toString().trim();
    
    if(updatedTitle != ''){
        
        axios({
            url: API_BASE_URL + `todo/${id}/`,
            method: 'patch',
            data: {
                title: updatedTitle,
                id: id
            },
            headers: {
                Authorization : `token ${localStorage.token}`,  
            }
        }).then(function(res, stat){
            getTasks();
        }).catch(err=>displayErrorToast(err))
    }

}

window.updateTask = updateTask;
window.deleteTask = deleteTask;
window.editTask = editTask;
