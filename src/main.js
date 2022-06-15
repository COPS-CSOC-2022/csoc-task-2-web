const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");
const logOutButton = document.getElementById("logout-button");
const addTaskButton = document.getElementById("add-task-button");


window.onload = () => {
    if (registerButton) {
        registerButton.addEventListener("click", register);
    }
    if (logOutButton) {
        logOutButton.addEventListener("click", logout);
    }
    if (loginButton) {
        loginButton.addEventListener("click", login);
    }
    if (addTaskButton) {
        addTaskButton.addEventListener("click", addTask)
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

function logout() {
    window.localStorage.removeItem('token');
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
        console.log(dataForApiRequest);

        axios({
            url: API_BASE_URL + 'auth/register/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function ({ data, status }) {
            localStorage.setItem('token', data.token);
            console.log("success");
            window.location.href = '/';
        }).catch(function (err) {
            displayErrorToast('An account using same email or username is already created');
        })
    }
}

function loginFieldsAreValid(username, password) {
    if (username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    return true;
}


function login() {

    /***
    * @todo Complete this function.
    * @todo 1. Write code for form validation.
    * @todo 2. Fetch the auth token from backend and login the user.
    */

    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();

    if (loginFieldsAreValid(username, password)) {
        displayInfoToast("Please wait...");
        const dataForApiRequest = {
            username: username,
            password: password
        }
        console.log(dataForApiRequest);
        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function ({ data, status }) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        }).catch((e) => {
            displayErrorToast("Incorrect Credentials");
        })
    }
}

function addTask() {

    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

    const task = document.querySelector("#task-to-add").value;

    console.log(task);

    if (!task.trim()) {
        displayErrorToast('Task cannot be Empty');
        return;
    }

    const dataForApiRequest = {
        title: task
    }

    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/create/',
        method: 'post',
        data: dataForApiRequest
    }).then(function (res) {

        axios({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo',
            method: 'get',
        }).then(function ({ data, status }) {

            const newData = data[data.length - 1];
            addNewData(newData);
            displaySuccessToast("Task Added Successfully");
        }).catch((err) => {
            displayErrorToast(err);
            console.log(err);
        })
    }).catch(function (err) {
        displayErrorToast(err);
        console.log(err);
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

    console.log(id);
    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'delete',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(function ({ data, status }) {

        document.querySelector(`#todo-${id}`).remove();
        displaySuccessToast("Task deleted Successfully!");

    }).catch(function (err) {
        displayErrorToast("Some Error Occured Please Refresh Page And Try Again");
    })
}



function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}



function addNewData(newData) {

    const tasksContainer = document.querySelector('.todo-available-tasks');

    const newNode = document.createElement('li');

    newNode.id = `todo-${newData.id}`;
    newNode.className = "list-group-item d-flex justify-content-between align-items-center";

    newNode.innerHTML =
        `
            <input id="input-button-${newData.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${newData.id}"  class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${newData.id}">Done</button>
            </div>
            <div id="task-${newData.id}" class="todo-task">
                ${newData.title}
            </div>
            
            <span id="task-actions-${newData.id}">
                <button style="margin-right:5px;" type="button" id="edit-task-${newData.id}"
                class="btn btn-outline-warning">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
                </button>
                
                <button type="button" class="btn btn-outline-danger" id="delete-task-${newData.id}">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>
    `;

    tasksContainer.appendChild(newNode);

    const editBut = document.querySelector(`#edit-task-${newData.id}`);
    const deleteBut = document.querySelector(`#delete-task-${newData.id}`);
    const updateBut = document.querySelector(`#update-task-${newData.id}`);

    editBut.addEventListener("click", () => editTask(newData.id));
    deleteBut.addEventListener("click", () => deleteTask(newData.id));
    updateBut.addEventListener("click", () => updateTask(newData.id));




}




export { addNewData };
