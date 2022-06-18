import axios from 'axios';
import { getTasks } from './init.js';
function displaySuccessToast(message) 
{
    iziToast.success
    ({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) 
{
    iziToast.error
    ({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) 
{
    iziToast.info
    ({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() 
{
    localStorage.removeItem('token');
    window.location.href = '/login/';
    displaySuccessToast("Logged out");
}
window.logout=logout;
function registerFieldsAreValid(firstName, lastName, email, username, password) 
{
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

function register() 
{
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) 
    {
        displayInfoToast("Please wait...");

        const dataForApiRequest = 
        {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        axios
        ({
            url: API_BASE_URL + 'auth/register/',
            method: 'POST',
            data: dataForApiRequest,
        }).then(function({data, status}) 
        {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
          displaySuccessToast("Registered as${data.username}");
        }).catch(function(err) 
        {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}
window.register=register;
function login() 
{
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend, login and direct user to home page.
     */
     const username = document.getElementById('inputUsername').value.trim();
     const password = document.getElementById('inputPassword').value;
     const dataForApiRequest = 
    {   
        username: username,
        password: password
    }
    axios
    ({
        url: API_BASE_URL + 'auth/login/',
        method: 'POST',
        data: dataForApiRequest,
    }).then(function({data, status}) 
    {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
      displaySuccessToast("Welcome ${data.username}");
    }).catch(function(err) 
    {
      displayErrorToast('Invalid username or password');
    })
 
}
window.login=login;
function addTask() 
{
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
     const title = document.getElementById("addTask").value.trim();
     const dataForApiRequest = {title: title,};
     axios
     ({
       headers: 
       {
         Authorization: "Token " + localStorage.getItem("token"),
       },
       url: API_BASE_URL + "todo/create/",
       method: "POST",
       data: dataForApiRequest,
     }).then(function ({ status }) 
       {
         displaySuccessToast("Task Added!");
         getTasks();
         // Get Tasks and render it into the DOM
        
        })
        .catch(function (err) 
        {
            console.error(err);
            displayErrorToast("Try Again!");
        });
    }
        
window.addTask=addTask;
function editTask(id) 
{
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
   
}
window.editTask=editTask;
function deleteTask(id) 
{
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    document.getElementById('task-' + id).classList.add('hideme');
    axios
    ({
        headers:
        {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url : API_BASE_URL+`todo/${id}`,
        method:'DELETE',
    }).then(({})=>{
        getTasks();
        displaySuccessToast("Deleted")
    })
}
window.deleteTask=deleteTask;
function updateTask(id) 
{
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const EdittedTask = document.getElementById("input-button-" + id).value.trim();
    const TaskId = document.getElementById("task-" + id);
    const dataForApiRequest = 
    {
        title: EdittedTask
    }
   
 
    axios
    ({
        headers:
        {
            Authorization: "Token " + localStorage.getItem("token"),
        },
         url: API_BASE_URL + 'todo/' + id + '/',
         method: 'PUT',
         data: dataForApiRequest,
     }).then(function ({ data, status }) 
    {
         taskItem.textContent=data.title;
         editTask(data.id);
         displaySuccessToast("Task Updated");
         getTasks();
     }).catch(function (err) 
     {
         displayErrorToast("Try Again");
     })
}
window.updateTask=updateTask;