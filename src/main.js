import axios from 'axios';
import { getTasks } from './init';
window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.editTask = editTask;
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const registerBtn = document.getElementById('register-btn');
const addtaskBtn = document.getElementById('add-task');
const searchBtn = document.getElementById('search-btn');
const cancelBtn = document.getElementById('cancel-btn');
window.onload = ()=>{

    if(loginBtn)
        loginBtn.onclick = login;
    
    if(logoutBtn)
        logoutBtn.onclick = logout;
    
    if(registerBtn)
        registerBtn.onclick = register;
    
    if(addtaskBtn)
        addtaskBtn.onclick = addTask;
    
    if(searchBtn)
        searchBtn.onclick = search;
    
    if(cancelBtn)
        cancelBtn.onclick = cancel;
    }
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
     const username = document.getElementById('inputUsername').value.trim();
     const password = document.getElementById('inputPassword').value;
 
     if (username == '' || password == '') {
         displayErrorToast("Please fill all the required fields.");
         return;
     }
     displayInfoToast("Loading");
     const dataForApiRequest = {
         username: username,
         password: password
     }
     axios({
         url: API_BASE_URL + 'auth/login/',
         method: 'POST',
         data: dataForApiRequest,
     }).then(function ({ data, status }) {
         displaySuccessToast("Logged in successfully");
         localStorage.setItem('token', data.token);
         window.location.href = '/';
     }).catch(function (err) {
         displayErrorToast("Invalid credentials");
         document.getElementById('inputUsername').value = '';
         document.getElementById('inputPassword').value = '';
     })
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
     const title = document.getElementById('new-task').value.trim();

     if (title == '') {
         displayErrorToast("Field cannot be empty.");
         return;
     }
 
     const dataForApiRequest = {
         title: title
     }
     
     
     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token"),
         },
         url: API_BASE_URL + 'todo/create/',
         method: 'post',
         data: dataForApiRequest,
     }).then(function ({ data, status }) {
         displaySuccessToast("Task added.");
         getTasks();
         document.getElementById('new-task').value ="";
     }).catch(function (err) {
         displayErrorToast("Something went wrong.");
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
     displayInfoToast("Loading...");

     const headersForApiRequest = {
         Authorization: 'Token ' + localStorage.getItem('token')
     }
 
     axios({
         headers: headersForApiRequest,
         url: API_BASE_URL + 'todo/' + id + '/',
         method: 'DELETE',
     }).then(function ({ data, status }) {
         displaySuccessToast("Task deleted successfully...");
         getTasks();
     }).catch(function (err) {
         displayErrorToast("Unable to delete task. Please try again...");
     })
}

export function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     const taskname =document.getElementById("input-button-" + id).value.trim();
    
     if (taskname == ""){
         displayErrorToast("Task name cannot be empty .");
         return;
     }
 
     const dataForApiRequest = {
         title: taskname
     }
     
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'put',
        data: dataForApiRequest,
     }).then(function ({ data, status }) {
        displaySuccessToast("Task updated successfully .");
        getTasks();
     }).catch(function (err) {
        displayErrorToast("Oops ! Something went wrong . ");
     })
}
function searchTask(){
    const task = document.getElementById('searchTask').value.trim();

    if (task == '') {
        displayErrorToast("Field cannot be left empty!..");
        return;
    }

    displayInfoToast("Loading...");

    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }

    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/',
        method: 'GET',
    }).then(function ({ data, status }) {
        console.log(data);
        for (var index = 0; index < data.length; index++) if (data[index].title == task){
            taskList.innerHTML = "";
            displaySuccessToast("Task Present");
            displayTask(data[index].id, data[index].title);
            return;
        }
        displayErrorToast("Task Not Found.")
    })
}