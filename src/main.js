import axios from 'axios';
import {getTasks} from './init';

if(document.getElementById('loginButton')) {
    document.getElementById('loginButton').onclick = login;
}
if(document.getElementById('registerButton')) {
    document.getElementById('registerButton').onclick = register;
}
if(document.getElementById('logoutButton')) {
    document.getElementById('logoutButton').onclick = logout;
}
if(document.getElementById('addTaskButton')) {
    document.getElementById('addTaskButton').onclick = addTask;
}
if(document.getElementById('searchTaskButton')) {
    document.getElementById('searchTaskButton').onclick = searchTask;
}

function displaySuccessToast(message) {
    iziToast.success({
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly!");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address!")
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
          displayErrorToast('An account using same email or username is already created!');
        })
    }
}

function login() {
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if(!username || !password) {
        displayErrorToast("Please enter valid credentials!");
    }
    else {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            username : username,
            password : password
        }

        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
            localStorage.setItem('token', data.token);
            displaySuccessToast("Login successful!");
            window.location.href = '/';
        }).catch(function(err) {
            displayErrorToast("Incorrect credentials! Try again!");
        })
    }
}

function addTask() {
    const task = document.getElementById('inputTask').value.trim();

    if(!task) {
        displayErrorToast("Task cannot be empty!");
    }
    else {
        displayInfoToast("Please wait...");
        const dataForApiRequest = {
            title: task
        }

        axios({
            url: API_BASE_URL + 'todo/create/',
            method: 'post',
            data: dataForApiRequest,
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            }
        }).then(function({data, status}) {
            getTasks();
            displaySuccessToast('Task added successfully!');
            document.getElementById('inputTask').value = null;
        }).catch(function(err) {
            displayErrorToast("Task could not be added! Try again!")
        })
    }
}

export function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

export function deleteTask(id) {

    displayInfoToast("Please wait...");

    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'delete',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        }
    }).then(function({data, status}) {
        displaySuccessToast("Task deleted successfully!");
        getTasks();
    }).catch(function(err) {
        displayErrorToast("Unable to delete task! Try again!")
    })
}

export function updateTask(id) {
    
    const newTask = document.getElementById('input-button-' + id).value.trim();
    const task = document.getElementById("task-" + id);

    if(newTask == null) {
        displayErrorToast("Task cannot be empty!");
    }
    else {

        const dataForApiRequest = {
            title: newTask
        }

        axios({
            url: API_BASE_URL + 'todo/' + id + '/',
            method: 'put',
            data: dataForApiRequest,
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            }
        }).then(function({data, status}) {
            task.textContent = data.title;
            editTask(data.id);
            displaySuccessToast("Task updated successfully!");
            getTasks();
        }).catch(function(err) {
            displayErrorToast("Task could not be updated! Please try again!");
        })
    }
}

function searchTask() {

    const task = document.getElementById('searchTask').value.trim();

    if(!task) {
        displayErrorToast("Task cannot be empty!");
    }
    else {

        axios({
            url: API_BASE_URL + 'todo/',
            method: 'get',
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            }
        }).then(function({data, status}) {

            for(let i=0; i<data.length; i++) {
                if(data[i].title == task) {

                    displaySuccessToast("Task Found!");
                    document.getElementById('searchTask').value = null;
                    let content = `
                    <li class="list-group-item d-flex justify-content-between align-items-center" class="taskElement" id="taskElement-${data[i].id}">
                    <input id="input-button-${data[i].id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                    <div id="done-button-${data[i].id}"  class="input-group-append hideme">
                    <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTaskButton${data[i].id}" onclick="updateTask(${data[i].id})">Done</button>
                    </div>
                    <div id="task-${data[i].id}" class="todo-task">
                    ${data[i].title}
                    </div>
                    <span id="task-actions-${data[i].id}">
                    <button style="margin-right:5px;" type="button" id="editTaskButton${data[i].id}" class="btn btn-outline-warning" onclick="editTask(${data[i].id})">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px">
                    </button>
                    <button type="button" class="btn btn-outline-danger" id="deleteTaskButton${data[i].id}" onclick="deleteTask(${data[i].id})">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px">
                    </button>
                    </span>
                    </li>
                    `
                    document.getElementById('tasksList').innerHTML = content;
                    return;
                }
            }
            document.getElementById('searchTask').value = null;
            displayErrorToast("The task was not found!");
        }).catch(function(err) {
            document.getElementById('searchTask').value = null;
            displayErrorToast("There was an error! Try again!");
        })
    }
}
