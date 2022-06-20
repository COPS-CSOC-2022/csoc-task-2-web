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
function loginFieldsAreValid(Username, Password) {
    if (Username === '' || Password === '') {
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
    var username = document.getElementById('inputUsername').value.trim();
    var password = document.getElementById('inputPassword').value.trim();

    if (username == "" || password == "") {
        displayErrorToast("Please fill all the required fields!");
        return;
    }

    displayInfoToast("Processing..");
    const userData = {
        username: username,
        password: password
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: userData
    })
        .then(function ({ data, status }) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        })
        .catch(function (err) {
            displayErrorToast("Account with given details not found! Try Again");
        })
}
    

    
    
    
}

function addTask() {
      const newTask = document.getElementById('enter-task').value.trim();
    if (newTask == "") {
        return;
    }
    const task = {
        title: newTask,
    }

    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + 'todo/create/',
        method: 'post',
        data: task,
    })
        .then(function ({ data, status }) {
            document.getElementById("enter-task").innerHTML = "";
            axios({
                headers: {
                    Authorization: "Token " + localStorage.getItem("token")
                },
                url: API_BASE_URL + 'todo/',
                method: 'get',
            }).then(function ({ data, status }) {
                var len = data.length;
                var id = data[len - 1].id;
                var list = $('#list');
                list.append(addNewField(title, id));
            })
        })
        .catch(function (error) {
            displayErrorToast("Could not add the task.");
        })
}
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    console.log("Deleting task");
    axios({
        headers: { Authorization: "Token " + localStorage.getItem('token') },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'delete',
    })
        .then(function ({ data, status }) {
            document.querySelector(`#todo-${id}`).remove();
            displaySuccessToast("Task deleted successfully");
        })
        .catch(function (err) {
            displayErrorToast(err);
        })
}
}

function updateTask(id) {
     const task = document.getElementById("input-button-" + id).value.trim();
    if (task != "") {
        axios({
            headers: { Authorization: "Token " + localStorage.getItem("token") },
            method: "patch",
            url: API_BASE_URL + "todo/" + id + "/",
            data: { title: task }
        }).then(function ({ data, status }) {
            document.getElementById("todo-" + id).classList.remove("hideme");
            document.getElementById("task-actions-" + id).classList.remove("hideme");
            document.getElementById("input-button-" + id).classList.add("hideme");
            document.getElementById("done-button-" + id).classList.add("hideme");
            document.getElementById("todo-" + id).innerText = task;
        }).catch(function (err) {
            displayErrorToast("Task not updated");
        })
    }
}
}
function addNewField(title, id) {
    const availableTasks = document.querySelector(".todo-available-tasks");
    const newTask = document.createElement("newElement");

    newTask.innerHTML = `
        <input id="input-button-${id}" type="text" class="form-control todo-edit-task-input hideme"  placeholder="Edit The Task">
        <div id="done-button-${id}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTaskBtn-${id}">Done</button>
        </div>
        <div id="task-${id}" class="todo-task">
            ${title}
        </div>
        <span id="task-actions-${id}">
            <button style="margin-right:5px;" type="button" id="editTaskBtn-${id}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="deleteTaskBtn-${id}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>`;
    newTask.id = `todo-${id}`;
    newTask.classList.add(
        "justify-content-between",
        "align-items-center",
        "list-group-item",
        "d-flex",
    );
    availableTasks.appendChild(newTask);

    document.getElementById("input-button-" + id).value = title;
    document.querySelector(`#editTaskBtn-${id}`).addEventListener("click", () => editTask(id));
    document.querySelector(`#updateTaskBtn-${id}`).addEventListener("click", () => updateTask(id));
    document.querySelector(`#deleteTaskBtn-${id}`).addEventListener("click", () => deleteTask(id));
}

if (document.getElementById('logout-btn')) {
    document.getElementById('logout-btn').onclick = logout;
}

if (document.getElementById('register-btn')) {
    document.getElementById('register-btn').onclick = register;
}

if (document.getElementById('login-btn')) {
    document.getElementById('login-btn').onclick = login;
}

if (document.getElementById('add-task-btn')) {
    document.getElementById('add-task-btn').onclick = addTask;
}

export { addNewField }; 
