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

const logout_btn = document.getElementById('logout-btn')
if (logout_btn) {
    logout_btn.addEventListener('click', logout);
}

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
let register_btn = document.getElementById('register-btn');
if (register_btn) {
    register_btn.addEventListener('click', register)
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
        }).then(function ({ data, status }) {
            localStorage.setItem('token', data.token);
            window.location.href = '/login/';
        }).catch(function (err) {
            displayErrorToast('An account using same email or username is already created');
        })
    }
}
const login_btn = document.getElementById('login-btn')
if (login_btn) {
    login_btn.addEventListener('click', login)
}
function login() {
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    console.log(username, password);
    displayInfoToast("Please wait...");
    const dataForApiRequest = {
        username: username,
        password: password
    }
    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiRequest,
    }).then(function ({ data, status }) {
        console.log(data);
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }
    ).catch(function (err) {
        console.log(err);
        displayErrorToast('Invalid username or password');
    }
    )
}
const add_btn = document.getElementById('add')
if (add_btn) {
    add_btn.addEventListener('click', addTask)
}


function addTask() {
    const task = document.getElementById('inputTask').value.trim();
    if (task === '') {
        displayErrorToast("Please enter a task");
        return;
    }
    displayInfoToast("Please wait...");

    const dataForApiRequest = {
        title: task

    }

    axios({
        url: API_BASE_URL + 'todo/create/',
        method: 'post',
        data: dataForApiRequest,
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    }).then(function ({ data, status }) {
        console.log(data);
        displaySuccessToast("Task added successfully");
        // location.reload();
    }
    ).catch(function (err) {
        console.log(err);
        displayErrorToast('Error adding task');
    }
    )
}


/**
 * @todo Complete this function.
 * @todo 1. Send the request to add the task to the backend server.
 * @todo 2. Add the task in the dom.
 */

const edit_btn = document.getElementById('edit-btn');
if (edit_btn) {
    edit_btn.addEventListener('click', () => {
        editTask(1);
    })
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
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}
