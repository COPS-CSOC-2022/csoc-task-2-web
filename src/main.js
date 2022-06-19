import axios from 'axios';


import { getTasks, displayTask } from './init';

window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.editTask = editTask;

const taskList = document.querySelector("#taskList");


const logoutButton = document.querySelector("#logoutButton");
if (logoutButton) logoutButton.onclick = logout;

const loginButton = document.querySelector("#loginButton");
if (loginButton) loginButton.onclick = login;

const registerButton = document.querySelector("#registerButton");
if (registerButton) registerButton.onclick = register;

const addTaskButton = document.querySelector("#addTaskButton");
if (addTaskButton) addTaskButton.onclick = addTask;


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

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend, login and direct user to home page.
     */
    
    const username = document.querySelector("#inputUsername").value.trim();
    const password = document.querySelector("#inputPassword").value;

    if (username == '' || password == '') {
        displayErrorToast("Don't leave any empty fields .");
        return;
    }

    displayInfoToast("Please wait...");

    const loginData = {
        username: username,
        password: password
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'POST',
        data: loginData,
    }).then(function ({ data, status }) {
        displaySuccessToast("You have successsfully logged in !!");
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }).catch(function (err) {
        displayErrorToast("Error couldnot log in !!!");
        username.value = '';
        password.value = '';
    })
    
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    
    const To_do_task = document.querySelector("#inputTask").value.trim();

    if (To_do_task === '') {
        displayErrorToast("Enter the field required..");
        return;
    }

    displayInfoToast("Please wait...");

    const dataForApiRequest = {
        title: To_do_task
    }
    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }

    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/create/',
        method: 'POST',
        data: dataForApiRequest,
    }).then(function ({ data, status }) {
        displaySuccessToast("Task has been added !!!");
        document.querySelector("#inputTask").value = '';
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Task could not be added ...Please try again !!");
    })
}

export function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

export function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    
    displayInfoToast("Please wait...");

    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }

    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE',
    }).then(function ({ data, status }) {
        displaySuccessToast("Task has been deleted successfully !!!");
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Not able to delete task..Please try again!!!");
    })
}

export function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    
    const UpdateTask = document.getElementById("input-button-" + id).value.trim();
    const Item = document.getElementById("task-" + id);

    if (UpdateTask==""){
        displayErrorToast("The task title can't be blank");
        return;
    }

    const dataForApiRequest = {
        title: UpdateTask
    }
    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }

    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'PUT',
        data: dataForApiRequest,
    }).then(function ({ data, status }) {
        Item.textContent=data.title;
        editTask(data.id);
        displaySuccessToast("Task has been updated !!!");
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Couldn't update task...Please try again !!!");
    })
}
