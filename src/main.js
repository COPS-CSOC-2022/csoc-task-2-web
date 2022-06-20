import axios from 'axios';
import { getTasks } from './init';

//Making buttons work
const logoutBtn = document.getElementById("logout")
const registerBtn = document.getElementById("register")
const loginBtn = document.getElementById("login")
const addTaskBtn = document.getElementById("addTaskButton");

window.onload = ()=>{
    if (logoutBtn) logoutBtn.onclick = logout
    if (loginBtn) loginBtn.onclick = login
    if (registerBtn) registerBtn.onclick = register
    if (addTaskBtn) addTaskButton.onclick = addTask;
}

function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

export function displayErrorToast(message) {
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
        }).then(function ({ data, status }) {
            console.log('hello')
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        }).catch(function (err) {
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

    const username = document.getElementById('inputUsername').value.trim()
    const password = document.getElementById('inputPassword').value

    if (username == '' || password == '') {
        displayErrorToast("Enter valid credentials");
        return;
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'POST',
        data: {
            username: username,
            password: password
        },
    }).then(({ data, status })=>{

        displaySuccessToast("Succesfully logged in")
        localStorage.setItem('token', data.token)
        window.location.href = '/'

    }).catch((err)=>{
        
        displayErrorToast("Invalid credentials")
        document.getElementById('inputUsername').value = ''
        document.getElementById('inputPassword').value = ''

    })
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const taskData = document.getElementById('inputTask').value.trim();

    if (taskData == '') {
        displayErrorToast("Blank task");
        return;
    }
 
    displayInfoToast("Wait");
 
    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }
 
    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/create/',
        method: 'POST',
        data: {
        title: taskData,
        },
    }).then(({ data, status }) => {
        displaySuccessToast("Task added");
        document.getElementById('inputTask').value = '';
        getTasks();
    }).catch((err) => {
        displayErrorToast("Failed to add task");
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
    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }

    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE',
    }).then(({ data, status }) => {
        displaySuccessToast("Task deleted");
        getTasks();
    }).catch((err) => {
        displayErrorToast("Failed to delete task");
    })
}

export function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const taskData = document.getElementById("input-button-" + id).value.trim();
    // const taskItem = document.getElementById("task-" + id);
 
    if (taskData==""){
        displayErrorToast("Blank task title");
        return;
    }
 
    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }
 
    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'PUT',
        data: {
            title: taskData
        }
    }).then(({ data, status }) => {
        // taskItem.textContent=data.title;
        // editTask(data.id);
        displaySuccessToast("Task updated");
        getTasks();
    }).catch((err) => {
        displayErrorToast("Failed to update task");
    })
}
