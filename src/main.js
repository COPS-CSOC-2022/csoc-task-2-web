import axios from 'axios';
import { newTask, getTasks } from './init';

window.editTask = editTask;
window.deleteTask = deleteTask;
window.updateTask = updateTask;

const addNewTask = document.getElementById('add-task');
if (addNewTask) addNewTask.onclick = addTask;


const registerButton = document.getElementById("register");
if (registerButton) registerButton.onclick = register;

const loginButton = document.getElementById("login");
if (loginButton) loginButton.onclick = login;

const logoutButton = document.getElementById("logout-button");
if (logoutButton) logoutButton.onclick = logout;

const deleteButton = document.getElementById(`delete-task-${tasks.id}`);
if (deleteButton) deleteButton.onclick = deleteTask;

const editButton = document.getElementById(`edit-task-${tasks.id}`);
if (editButton) editButton.onclick = editTask;

const updateButton = document.getElementById(`update-task-${tasks.id}`);
if (updateButton) updateButton.onclick = updateTask;




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
    displaySuccessToast('Logged Out');
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
        })
        .then(function({data, status}) {
          localStorage.setItem('token', data.token);
          displaySuccessToast('Registered Successfulyy');
          window.location.href = '/';
        })
        .catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}

function login() {
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (username == '' || password == '') {
        displayErrorToast("Please enter the required fields.");
        return;
    };
    const dataReq = {
        username: username,
        password: password
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'POST',
        data: dataReq,
    }).then(function ({ data, status }) {
        displaySuccessToast("You are logged in successfully");
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }).catch(function (err) {
        displayErrorToast("The credentials used are invalid.");
        document.getElementById('inputUsername').value = '';
        document.getElementById('inputPassword').value = '';
    })
}

function addTask() {
    const task = document.getElementById('task-input').value.trim();

    if (task == '') {
        displayErrorToast("Todo cannot be blank");
        return;
    }

    displayInfoToast("Loading...");

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
        displaySuccessToast("Todo added successfully");
        document.getElementById('task-input').value = '';
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Unable to add the todo. Please try again");
    })
};

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }

    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE',
    }).then(function ({ data, status }) {
        displaySuccessToast("Deleted Successfully");
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Try Again");
    })
}

function updateTask(id) {
    const newTask = document.getElementById("input-button-" + id).value.trim();
    const taskItem = document.getElementById("task-" + id);

    if (newTask==""){
        displayErrorToast("The todo title can't be blank");
        return;
    }

    const dataForApiRequest = {
        title: newTask
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
        taskItem.textContent=data.title;
        editTask(data.id);
        displaySuccessToast("Todo updated successfully...");
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Unable to update the todo. Please try again...");
    })
}
