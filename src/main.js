import axios from 'axios';
import { displayTask, getTasks } from './init';
window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.editTask = editTask;
const taskList = document.getElementById("taskList");

const registerBtn = document.getElementById("registerBtn");
if (registerBtn) registerBtn.onclick = register;
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) loginBtn.onclick = login;
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) logoutButton.onclick = logout;
const addTaskButton = document.getElementById("addTaskButton");
if (addTaskButton) addTaskButton.onclick = addTask;
const searchTaskButton = document.getElementById("searchTaskButton");
if (searchTaskButton) searchTaskButton.onclick = searchTask;

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
        // displayErrorToast("Please enter a valid email address.")
        alert("Please enter a valid email address.")
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
        
        alert("An account using same email or username is already created.")
        })
    }
}

function login() {
    
     const username = document.getElementById('inputUsername').value.trim();
     const password = document.getElementById('inputPassword').value;

     if (username == '' || password == '') {
        
        alert("Username or Password cannot be empty.")
         return;
     }
    
     const dataForApiRequest = {
         username: username,
         password: password
     }
     axios({
         url: API_BASE_URL + 'auth/login/',
         method: 'POST',
         data: dataForApiRequest,
     }).then(function ({ data, status }) {
        
        alert("You are successfully logged in.")
         localStorage.setItem('token', data.token);
         window.location.href = '/';
     }).catch(function (err) {
        
        alert("The above credentials are invalid.")
         document.getElementById('inputUsername').value = '';
         document.getElementById('inputPassword').value = '';
     })

}

function addTask() {
    
     const task = document.getElementById('inputTask').value.trim();

     if (task == '') {
         alert("Task cannot be empty....");
         return;
     }
     
     

    

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
      
         document.getElementById('inputTask').value = '';
         getTasks();
        
     }).catch(function (err) {
      
        alert("Unable to add task. Please try again.");
     })

}

 export function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

 export function deleteTask(id) {
  

     const headersForApiRequest = {
         Authorization: 'Token ' + localStorage.getItem('token')
     }
   

     axios({
         headers: headersForApiRequest,
         url: API_BASE_URL + 'todo/' + id + '/',
         method: 'DELETE',
     }).then(function ({ data, status }) {
      
         getTasks();
     }).catch(function (err) {
 
     })
     alert("Your task will be deleted");

}

 export function updateTask(id) {
    
     const newTask = document.getElementById("input-button-" + id).value.trim();
     const taskItem = document.getElementById("task-" + id);
 
     if (newTask==""){
         alert("Task title cannot be empty");
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
        
        alert("Task updated successfully")
         getTasks();
     }).catch(function (err) {
         alert("Unable to update task. Please try again.");
     })
 }
 
 function searchTask(){
     const task = document.getElementById('searchTask').value.trim();
 
     if (task == '') {
         alert("Task cannot be empty.");
         return;
     }
 
    
 
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
            
             displayTask(data[index].id, data[index].title);
             return;
         }
         alert("No such task exists.")
     })
}