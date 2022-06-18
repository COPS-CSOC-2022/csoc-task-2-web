import axios from 'axios';

function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
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

window.logout = function() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
}

window.registerFieldsAreValid = function(firstName, lastName, email, username, password) {
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

window.register = function() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

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

window.login = function() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend, login and direct user to home page.
     */
    const usr_name = document.getElementById('inputUsername').value.trim();
    const passwd = document.getElementById('inputPassword').value.trim();
    
    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: {
            username: usr_name,
            password: passwd
        }
    }).then(function({data, status}){
        console.log("login was successfull");
        localStorage.setItem('token', data.token);
        window.location.href = '/';
        displaySuccessToast("Logged In successfully...");
        getTasks();
    }).catch(function(err){
        console.log("Login unsuccessfull !!! ")
        displayErrorToast('Invalid Credentials');
    })
}

window.addTask = function () {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const inp = document.getElementById("add-task").value;
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + "todo/create/",
        method: 'post',
        data: {
            title: inp
        }
    }).then(function({}){
        displaySuccessToast('Add Task Successfull...');
        document.getElementById('add-task').value = '';
        getTasks();
    }).catch(function(err){
        console.log(err)
        displayErrorToast("Add Task was unsuccessfull...");
    })
    console.log("addTask clicked");
}

window.editTask = function(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

window.deleteTask = function(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        },
        url: API_BASE_URL + "todo/"+id+"/",
        method: 'delete'
    }).then(function(){
        displaySuccessToast("Task Deleted Successfully...");
        getTasks();
    })
     console.log("deleteTask clicked");
}
window.updateTask = function(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const newTitle = document.getElementById(`input-button-${id}`).value.trim();
    const taskItem = document.getElementById(`task-${id}`);
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        },
        url: API_BASE_URL + "todo/"+id+"/",
        method: 'PUT',
        data: {
            title: newTitle
        }
    }).then(function(){
        displaySuccessToast("Task Edited Successfully...")
        getTasks();
    })
     console.log("updateTask clicked");
}
