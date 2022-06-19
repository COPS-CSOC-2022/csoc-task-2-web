import axios from 'axios';
import { getTasks } from './init';

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const registerBtn = document.getElementById('register-btn');
const addtaskBtn = document.getElementById('add-task');
const searchBtn = document.getElementById('search-btn');
const cancelBtn = document.getElementById('cancel-btn');

window.editTask=editTask;
window.updateTask=updateTask;
window.deleteTask=deleteTask;

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

function loginFieldsAreValid(username, password) {
    if (username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
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

     if (loginFieldsAreValid(username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            username: username,
            password: password
        }

        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('Invalid username or password');
        })
    }
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    
    const title = document.getElementById('new-task').value.trim();

    if (title == '') {
        displayErrorToast("Task name cannot be epmty .");
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
        displaySuccessToast("Task added successfully .");
        getTasks();
        document.getElementById('new-task').value ="";
    }).catch(function (err) {
        displayErrorToast("Oops ! Something went wrong .");
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
    axios({
         headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
         url: API_BASE_URL + 'todo/' + id + '/',
         method: 'delete',
     }).then(function ({ data, status }) {
        console.log(localStorage.getItem('token'));
         displaySuccessToast("Task deleted successfully .");
         getTasks();
     }).catch(function (err) {
         displayErrorToast("Oops ! Something went wrong .");
     })
}

function updateTask(id) {
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

function search(){

    const title = document.getElementById('search-input').value.trim();
    const tasks = document.getElementById('tasks');
    document.getElementById('search-btn').classList.add('hideme');
    document.getElementById('cancel-btn').classList.remove('hideme');

    if(title == ""){
        displayErrorToast("Search field cannot be empty .");
        return ;
    }

    axios({
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + "todo/",
      })
        .then(function ({ data, status }) {
          tasks.innerHTML=` <span class="badge badge-primary badge-pill todo-available-tasks-text">
          Search Result
      </span>`;
          for(var i=0;i<data.length;i++)
          {
            if(title == data[i].title)
            {
                tasks.innerHTML+= `<li class="list-group-item d-flex justify-content-between align-items-center" id="taskItem-${data[i].id}">
            <input id="input-button-${data[i].id}" type="text" class="form-control todo-edit-task-input hideme"
                placeholder="Edit The Task">
            <div id="done-button-${data[i].id}" class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button"
                    onclick="updateTask(${data[i].id})">Done</button>
            </div>
            <div id="task-${data[i].id}" class="todo-task">
                ${data[i].title}
            </div>
            <span id="task-actions-${data[i].id}">
                <button style="margin-right:5px;" type="button" onclick="editTask(${data[i].id})"
                    class="btn btn-outline-warning">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                        width="18px" height="20px">
                </button>
                <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${data[i].id})">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>
        </li>`;
            }
          }

          if(tasks.innerHTML == ` <span class="badge badge-primary badge-pill todo-available-tasks-text">
          Search Result
      </span>` )
             displayErrorToast('Required task not found .')
            else
            displaySuccessToast('Required task found successfully .');
        })
        .catch(function (err) {
          displayErrorToast("Oops ! Something went wrong . ");
        });
    
}


function cancel(){

    document.getElementById('search-input').value="";
    document.getElementById('search-btn').classList.remove('hideme');
    document.getElementById('cancel-btn').classList.add('hideme');
    getTasks();

}
