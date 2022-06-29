import axios from 'axios';
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

    if (!registerFieldsAreValid(firstName, lastName, email, username, password)) {
        return
    }

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
    }).then(({data, status}) => {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
        displaySuccessToast('Account registered successfully\nRedirecting to main page...')
    }).catch( err => {
        displayErrorToast('An account using same email or username is already created');
    })
}

function login() {
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    
    if (username === '' || password === '') {
        displayErrorToast("Please enter a valid username and password")
        return
    }

    const dataForApiRequest = {
        username: username,
        password: password
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiRequest,
    }).then(({data, status}) => {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
        displaySuccessToast('Login Success')
    }).catch( err => {
        displayErrorToast('Incorrect Username or Password');
    })
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const input = document.getElementById('new-task')
    axios({
        url: API_BASE_URL + 'todo/create/',
        method: 'POST',
        headers: {Authorization: `token ${localStorage.getItem('token')}`},
        data: {title: input.value}
    }).then(() => {
        inflateTasks()
        input.value = ''
        displaySuccessToast('Task created successfully')
    })
}

function editTask(id) {
    const input = document.getElementById('input-button-' + id)
    const task = document.getElementById('task-' + id)
    input.value = task.innerText
    task.classList.add('hideme')
    input.classList.remove('hideme')
    document.getElementById('task-actions-' + id).classList.add('hideme')
    document.getElementById('done-button-' + id).classList.remove('hideme')
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    axios({
        url: API_BASE_URL + `todo/${id}/`,
        method: 'DELETE',
        headers: {Authorization: `token ${localStorage.getItem('token')}`},
    }).then(() => {
        inflateTasks()
        displaySuccessToast('Task deleted successfully')
    })

}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const input = document.getElementById('input-button-' + id)
    const task = document.getElementById('task-' + id)
    task.innerText = input.value
    input.classList.add('hideme');
    task.classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme')
    document.getElementById('done-button-' + id).classList.add('hideme')
    
    axios({
        url: API_BASE_URL + `todo/${id}/`,
        method: 'PUT',
        headers: {Authorization: `token ${localStorage.getItem('token')}`},
        data: {title: task.innerText}
    }).then(() => {
        displaySuccessToast('Task name changed successfully')
    })
}

async function getTasks() {
    const {data} = await axios({
        url: API_BASE_URL + 'todo/',
        method: 'GET',
        headers: {Authorization: `token ${localStorage.getItem('token')}`}
    })
    return data
}

async function inflateTasks(data) {
    if (data === undefined) {
        data = await getTasks()
    }
    const taskHolder = document.querySelector('#task-holder')
    taskHolder.innerHTML =
            `<span class="badge badge-primary badge-pill todo-available-tasks-text">
                Available Tasks
            </span>`
    data.forEach(({id, title}) => {
        taskHolder.innerHTML +=
            `<li class="list-group-item d-flex justify-content-between align-items-center">
                <input id="input-button-${id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                <div id="done-button-${id}"  class="input-group-append hideme">
                    <button id="update-task-${id}" class="btn btn-outline-secondary todo-update-task" type="button">Done</button>
                </div>
                <div id="task-${id}" class="todo-task">
                    ${title}
                </div>

                <span id="task-actions-${id}">
                    <button id="edit-task-${id}" style="margin-right:5px;" type="button" class="btn btn-outline-warning">
                        <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                            width="18px" height="20px">
                    </button>
                    <button id="delete-task-${id}" type="button" class="btn btn-outline-danger">
                        <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                            width="18px" height="22px">
                    </button>
                </span>
            </li>`
    })
        
    data.forEach(({id}) => {    
        document.querySelector(`#edit-task-${id}`).addEventListener('click', () => editTask(id))
        document.querySelector(`#update-task-${id}`).addEventListener('click', () => updateTask(id))
        document.querySelector(`#delete-task-${id}`).addEventListener('click', () => deleteTask(id))
    })
}

let searchData

async function search(mode) {
    if (mode === 'focus') {
        searchData = await axios({
            url: API_BASE_URL + 'todo/',
            method: 'GET',
            headers: {Authorization: `token ${localStorage.getItem('token')}`}
        }).then(obj => obj.data)
    } else if (mode === 'input') {
        const text = document.querySelector('#search-box').value.trim().toLowerCase()
        const data = searchData.filter(({title}) => title.toLowerCase().indexOf(text) !== -1)
        inflateTasks(data)
    }
}

if (window.location.pathname === '/register/') {
    document.querySelector('#btn-register').addEventListener('click', register);
} else if (window.location.pathname === '/login/') {
    document.querySelector('#btn-login').addEventListener('click', login);
} else if (window.location.pathname === '/') {
    document.querySelector('#btn-logout').addEventListener('click', logout);
    document.querySelector('#btn-addTask').addEventListener('click', addTask);
    document.querySelector('#search-box').addEventListener('focus', () => search('focus'));
    document.querySelector('#search-box').addEventListener('input', () => search('input'));
    inflateTasks();
}