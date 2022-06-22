import axios from 'axios';
import { getTasks } from './init';
const logoutBtn = document.getElementById("logout")
const registerBtn = document.getElementById("register")
const loginBtn = document.getElementById("login")
const addTaskBtn = document.getElementById("addTaskButton");
const searchTaskBtn = document.getElementById("searchTaskBtn");


window.onload = ()=>{
    if (logoutBtn) logoutBtn.onclick = logout
    if (loginBtn) loginBtn.onclick = login
    if (registerBtn) registerBtn.onclick = register
    if (addTaskBtn) addTaskButton.onclick = addTask;
    if (searchTaskBtn) searchTaskBtn.onclick = searchTask;
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
     const enteredTask = document.getElementById('inputTask').value.trim();

     if (enteredTask == '') {
         displayErrorToast("Invalid Task Title : Empty");
         return;
     }
 
     displayInfoToast("Adding Task");
 
     const headersForApiRequest = {
         Authorization: 'Token ' + localStorage.getItem('token')
     }
 
     axios({
         headers: headersForApiRequest,
         url: API_BASE_URL + 'todo/create/',
         method: 'POST',
         data: {
         title: enteredTask,
         },
     }).then(({ data, status }) => {
         displaySuccessToast("Task added successfully");
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

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
     export function deleteTask(id) {
        displayInfoToast("Deleting Task");
     
          const headersForApiRequest = {
              Authorization: 'Token ' + localStorage.getItem('token')
          }
     
          axios({
              headers: headersForApiRequest,
              url: API_BASE_URL + 'todo/' + id + '/',
              method: 'DELETE',
          }).then(function ({ data, status }) {
              displaySuccessToast("Task deleted successfully");
              getTasks();
          }).catch(function (err) {
              displayErrorToast("Failed to delete task.Try again later");
          })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     export function updateTask(id) {
        const newTask = document.getElementById("input-button-" + id).value.trim();
        const task = document.getElementById("task-" + id);
    
        if (newTask==""){
            displayErrorToast("Invalid Task Title : Empty");
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
            task.textContent=data.title;
            editTask(data.id);
            displaySuccessToast("Task updated successfully");
            getTasks();
        }).catch(function (err) {
            displayErrorToast("Failed to update task. Try again later");
        })
    }
    
    function searchTask(){
        const taskforSearch = document.getElementById('searchTask').value.trim();
    
        if (taskforSearch == '') {
            displayErrorToast("Invalid Task Title : Empty");
            return;
        }
    
        displayInfoToast("Searching");
    
        const headersForApiRequest = {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    
        axios({
            headers: headersForApiRequest,
            url: API_BASE_URL + 'todo/',
            method: 'GET',
        }).then(function ({ data, status }) {
            console.log(data);
            for (var j = 0; j < data.length; j++) if (data[j].title == taskforSearch){
                displaySuccessToast("Task found");
    
    
    
                return;
            }
            displayErrorToast("Specified task does not exist")
        })
    }
