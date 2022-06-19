import axios from 'axios';

import {getTasks,displayTask} from './init';


window.editTask=editTask;
window.deleteTask=deleteTask;
window.updateTask=updateTask;

const taskList=document.querySelector("#todoTaskList");

window.onload=()=>{
    const registerBtn=document.querySelector("#registerBtn");
    if(registerBtn){
        registerBtn.onclick=register;
    }
    const loginBtn=document.querySelector("#loginBtn");
    if(loginBtn){
        loginBtn.onclick=login;
    }
    const addTaskBtn=document.querySelector("#addTaskBtn");
    if(addTaskBtn){
        addTaskBtn.onclick=addTask;
    }
    const logoutBtn=document.querySelector("#logoutBtn");
    if(logoutBtn){
        logoutBtn.onclick=logout;
    }
    const searchBtn=document.querySelector("#searchBtn");
    if(searchBtn){
        searchBtn.onclick=searchTask;
    }
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



//logout function
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

//register function
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
          displaySuccessToast("Registered Successfully...");
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}



//valid login details
function loginFieldsAreValid(username,password){

    if(username===''||password===''){
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }

    return true;
}


//login function
function login() {
    
    // @todo Complete this function.
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();
    if(loginFieldsAreValid(username,password)){
        displayInfoToast("Please wait....");

        const loginDataForApiRequest={
            username: username,
            password: password
        }

        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: loginDataForApiRequest,
        }).then(function({data, status}) {
          displaySuccessToast("Logged In Successfully...");
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('Write correct password or correct username');
          username.value = '';
          password.value = '';
        })
    }
    // @todo 1. Write code for form validation.
    // @todo 2. Fetch the auth token from backend, login and direct user to home page.
    
}

//search Task
function searchTask(){
    const task= document.getElementById('searchTaskValue').value.trim();
    if(task===''){
        displayErrorToast("Enter a Task");
        return;
    }

    displayInfoToast("Please wait...");

    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }
    axios({
        headers:headersForApiRequest,
        url: API_BASE_URL + 'todo/',
        method: 'GET',
    }).then(function({data, status}) {
        document.getElementById('searchTaskValue').value = '';
        for (var ind = 0; ind < data.length; ind++){
            if (data[ind].title == task){
                taskList.innerHTML = "";
                displaySuccessToast("Task found...");
                displayTask(data[ind].id, data[ind].title);
                return;
            }
        } 
      displayErrorToast("The Task was not found in the todo List...")
    }).catch(function(err) {
      displayErrorToast('Unable to search a task in the todo ......');
    })


}




//Adding TAsk
function addTask() {
    
    //   @todo Complete this function.
    //   @todo 1. Send the request to add the task to the backend server.
    const task= document.getElementById('addTaskValue').value.trim();

    if (task === '') {
        displayErrorToast("Please Enter the Task...");
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
        displaySuccessToast("Task Added in the Todo Succesfully ....")
        document.getElementById('addTaskValue').value = '';
        getTasks();
    }).catch(function (err) {
        displayErrorToast('Unable to add a task in the todo ......');
    })
    //   @todo 2. Add the task in the dom.
     
}



export function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

export function deleteTask(id) {
    
    //  @todo Complete this function.
    //  @todo 1. Send the request to delete the task to the backend server.
    //  @todo 2. Remove the task from the dom.
     

    displayInfoToast("Please wait...");

    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }

    axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE',
    }).then(function ({ data, status }) {
        displaySuccessToast("Item deleted from the todo successfully...");
        getTasks();
    }).catch(function (err) {
        displayErrorToast("Unable to delete the given task. Please try again...");
    })

}

export function updateTask(id) {
    
    //  @todo Complete this function.
    //  @todo 1. Send the request to update the task to the backend server.
    //  @todo 2. Update the task in the dom.
     

     displayInfoToast("Please wait...");

     //update task=inout-btn-id,taskNumber =task-id
     const updateTask=document.getElementById("input-button-"+id).value.trim();
     const taskItem=document.getElementById("task-"+id);

     if (updateTask===""){
        displayErrorToast("Enter a Task in the Todo...");
        return;
    }
     const updateForApiRequest={
        title: updateTask
     }

     const headersForApiRequest = {
         Authorization: 'Token ' + localStorage.getItem('token')
     }
 
     axios({
         headers: headersForApiRequest,
         data: updateForApiRequest,
         url: API_BASE_URL + 'todo/' + id + '/',
         method: 'PUT',
     }).then(function ({ data, status }) {
        taskItem.textContent=data.title;
        editTask(data.id);
         displaySuccessToast("Item in todo list updated successfully...");
         getTasks();
     }).catch(function (err) {
         displayErrorToast("Unable to update the item in todo. Please try again...");
     })

}
