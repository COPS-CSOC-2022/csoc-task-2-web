import axios from 'axios';
import { displayTask, getTasks } from './init';

window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.editTask = editTask;

const taskList = document.getElementById("taskList");


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

const logout_button = document.getElementById("logoutButton");
if (logout_button) logout_button.onclick = logout;
const login_button = document.getElementById("loginButton");
if (login_button) login_button.onclick = login;
const register_button = document.getElementById("registerButton");
if (register_button) register_button.onclick = register;
const add_task_button = document.getElementById("addTaskButton");
if (add_task_button) add_task_button.onclick = addTask;

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
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (username == '' || password == '') {
        displayErrorToast("Enter the fields required!!!");
        return;
    }

    displayInfoToast("Please wait...");

    const data = {
        username: username,
        password: password
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'POST',
        data: data,
    }).then(function ({ data, status }) {
        displaySuccessToast("You have successfully logged in.");
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }).catch(function (err) {
        displayErrorToast("Invalid Credentials!!!");
        username.value = '';
        password.value = '';
    })
}

function addTask() {
    const task = document.getElementById('inputTask').value.trim();

    if (task === '') {
        displayErrorToast("Task cannot be empty...");
        return;
    }

    displayInfoToast("Please wait...");

    const dataForApiRequest = {
        title: task
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
        displaySuccessToast("Todo has been added successfully!!!");
        document.getElementById('inputTask').value = '';
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Failure in adding the task. Please try again...");
    })

}

export function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

export function deleteTask(id) {
    displayInfoToast("Please wait...");

    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }

    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE',
    }).then(function ({ data, status }) {
        displaySuccessToast("Todo has been successfully deleted...");
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Failure in deleting the task. Please try again...");
    })
}

export function updateTask(id) {
    const newTodo = document.getElementById("input-button-" + id).value.trim();
    const todoItem = document.getElementById("task-" + id);

    if (newTodo==""){
        displayErrorToast("Todo cannot be empty...");
        return;
    }

    const dataForApiRequest = {
        title: newTodo
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
        todoItem.textContent=data.title;
        editTask(data.id);
        displaySuccessToast("Todo has been successfully updated...");
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Failure in updating the task. Please try again...");
    })
}
