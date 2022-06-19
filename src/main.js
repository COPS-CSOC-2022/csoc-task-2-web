import axios from 'axios';
//import getTasks from init.js using import
import {getTasks} from './init';
import {getSearchedTasks} from './init';

window.register = register;
window.login = login;
window.addTask = addTask;
window.logout=logout;
window.deleteTask=deleteTask;
window.editTask=editTask;
window.updateTask=updateTask;
window.searchTask=searchTask;

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
        }).then(function ({ data, status }) {
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
    //  const username = username;
    //  const password = password;

    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    const dataForApiRequest = {
        username: username,
        password: password
    }
    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiRequest,
    }).then(function ({ data, status }) {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }).catch(function (err) {
        displayErrorToast('Account does not exist, please register first');
    })
}


function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

    const todoInput = document.querySelector("input");
    const todoCollection = document.querySelector(".todo-available-tasks");


    const dataForApiRequest = {
        title: todoInput.value,
    }
    //check whether the task is empty or not
    if (todoInput.value === '') {
        displayErrorToast("Please enter a task");
    }
    else {



        //get token from local storage for authentication
        const token = localStorage.getItem('token');
        axios({
            url: API_BASE_URL + 'todo/create/',
            method: 'post',
            headers: {
                'Authorization': 'Token ' + token
            },
            data: dataForApiRequest,
        }).then(function ({ data, status }) {
          console.log(data);
          getTasks()
            todoInput.value = '';
        }).catch(function (err) {
            displayErrorToast('An error occured while adding the task');

        }
        )

    }

}
// if (todoInput.value === "") {
//     alert("enter something!");
// } else {
//     const li = document.createElement("li");
//     const todoTitle = document.createElement("span");
//     li.classList.add("todo-available-tasks-text");
//     todoTitle.classList.add("list-items");
//     todoTitle.innerText = todoInput.value;

//     li.appendChild(todoTitle);
//     todoCollection.appendChild(li);

// }


// axios({
//     url: API_BASE_URL + 'todo/create/',
//     method: 'post',
//     data: dataForApiRequest,
// }).then(function ({ data, status }) {
//     localStorage.setItem('token', data.token);
//     window.location.href = '/';
// }).catch(function (err) {
//     displayErrorToast('please login');
// })


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


    const token = localStorage.getItem('token');
    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'delete',
        headers: {
            'Authorization': 'Token ' + token
        },
    }).then(function ({ data, status }) {
        // getTasks()
        //success toast
        displaySuccessToast('Task deleted successfully');
        //select the task from the dom
        const task = document.getElementById(id);
        //remove the task from the dom
        task.remove();

    }).catch(function (err) {
        displayErrorToast('An error occured while deleting the task');
    
    }
    )
    //delete the task from the dom
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');

}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
   //update the edited task and save to dom
   console.log(id);
    const todoInput = document.getElementById("input-button-" + id);
    console.log(todoInput);
    const todoCollection = document.querySelector(".todo-available-tasks");
    const token = localStorage.getItem('token');
    const dataForApiRequest = {
        title: todoInput.value,
    }
    console.log(todoInput.value)
    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'put',
        headers: {
            'Authorization': 'Token ' + token
        },
        data: dataForApiRequest,
    }).then(function ({ data, status }) {
        getTasks()
        //success toast
        displaySuccessToast('Task updated successfully');

    }).catch(function (err) {
        displayErrorToast('An error occured while updating the task');
    }   
    )
//save the edited task to dom
    document.getElementById('task-' + id).classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme');
    document.getElementById('input-button-' + id).classList.add('hideme');
    document.getElementById('done-button-' + id).classList.add('hideme');

    //show the updated tasks in the dom
    // const li = document.createElement("li");
    // const todoTitle = document.createElement("span");
    // li.classList.add("todo-available-tasks-text");
    // todoTitle.classList.add("list-items");
    // todoTitle.innerText = todoInput.value;

   


        
}
//call a function on click of search button
function searchTask()   {
    displayInfoToast("Searching Task...");


    const token = localStorage.getItem('token');
    axios({
        url: API_BASE_URL + 'todo/',
        method: 'get',
        headers: {
            'Authorization': 'Token ' + token
        },
    }).then(function ({ data, status }) {
        console.log(data);   
        //filter the tasks based on the search input
        const searchInput = document.getElementById('search-input').value;
        const filteredTasks = data.filter(function (task) {
            return task.title.toLowerCase().includes(searchInput.toLowerCase());
        }
        );
        console.log(filteredTasks);
        getSearchedTasks(filteredTasks);
        displaySuccessToast('Tasks searched successfully');

    }).catch(function (err) {
        displayErrorToast('An error occured while getting the tasks');
    })
}


    