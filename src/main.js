import axios from 'axios';
import { getTasks } from './init';


window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.editTask = editTask;

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



// const list_group = document.querySelector('.list-group');
// function display_added_task(data) {
//     console.log(data);
//     const tasks_container = document.createElement('li');

//     // get request to Api to get the task
//     axios({
//         url: API_BASE_URL + 'todo/' + data.id + '/',
//         method: 'get',
//         headers: {
//             Authorization: 'Token ' + localStorage.getItem('token')
//         }
//     }).then(function ({ data, status }) {
//         console.log(data);
//         tasks_container.id = 'task-' + data.id;
//     }).catch(function (error) {
//         console.log(error);
//     }
//     )




//     // set the id of the task

//     tasks_container.classList.add('list-group-item');
//     tasks_container.classList.add('d-flex');
//     tasks_container.classList.add('justify-content-between');
//     tasks_container.classList.add('align-items-center');

//     const task_name = document.createElement('div');
//     task_name.classList.add('todo-task');
//     task_name.innerHTML = data.title;

//     const span = document.createElement('span');
//     const btn_1 = document.createElement('button');
//     btn_1.classList.add('btn');
//     btn_1.classList.add('btn-outline-warning');
//     btn_1.style.marginRight = '10px';
//     const btn_2 = document.createElement('button');
//     btn_2.classList.add('btn');
//     btn_2.classList.add('btn-outline-danger');

//     // set on click attribute to the btn_2 element to delete the task

//     span.append(btn_1, btn_2);
//     tasks_container.append(task_name, span);
//     list_group.append(tasks_container);
//     const img_1 = document.createElement('img');
//     img_1.src = 'https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png';
//     img_1.width = '18';
//     img_1.height = '20';
//     btn_1.appendChild(img_1);
//     const img_2 = document.createElement('img');
//     img_2.src = 'https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg';
//     img_2.width = '18';
//     img_2.height = '22';
//     btn_2.appendChild(img_2);
// }



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

        // clear the input field
        document.getElementById('inputTask').value = '';

        displaySuccessToast("Task added successfully");
        // get element form the dom and copy it to the dom
        // display_added_task(dataForApiRequest);
        getTasks();
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



function deleteTask(_id) {
    displayInfoToast('Please wait...');

    axios({
        url: API_BASE_URL + 'todo/' + _id + '/',
        method: 'delete',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(function ({ dat, stat }) {

        displaySuccessToast('Task deleted successfully');
        console.log(dat);
        // remove the task from the dom
        const task_to_delete = document.getElementById('task-' + _id);
        task_to_delete.remove();
    }).catch(function (error) {
        displayErrorToast('Error deleting task');
        console.log(error);
    }
    );
}

/**
 * @todo Complete this function.
 * @todo 1. Send the request to delete the task to the backend server.
 * @todo 2. Remove the task from the dom.
 */


function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}
