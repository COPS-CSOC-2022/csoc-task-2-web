import axios from 'axios';
import exports from "./init.js";

setClickListeners();
setDeleteListeners();

function setClickListeners() {
    const btnArrays = [];
    const btnListenerFuncs = [login, register, addTask];

    btnArrays.push(document.querySelector("#login-btn"));
    btnArrays.push(document.querySelector("#register-btn"));
    btnArrays.push(document.querySelector("#add-task-btn"));

    btnArrays.forEach((element, index) => {
        if (element !== null) {
            console.log(element.id);
            element.addEventListener("click", () => {
                btnListenerFuncs[index]();            
            });
        }
    }); 
}

function setDeleteListeners() {
    const deleteBtns = Array.from(document.querySelectorAll(".btn-task-del"));

    deleteBtns.forEach((element) => {
        element.addEventListener("click", () => {
            deleteTask(element.dataset.id);
        });
    });
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

// function to validate login fields, uses name similar to regsiterFieldsAreValid to maintain project consistency
function loginFieldsAreValid(username, password) {
    if (username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }

    return true;
}

function register() {
    alert("register's still not bitten the dust")

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

    // testing if the event listeners work
    // alert("login event listener didn't get l + ratio'd");

    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    console.log(username, password);

    if (loginFieldsAreValid(username, password)) {
        displayInfoToast("Please wait...");

        const loginReqData = {
            username: username,
            password: password
        };

        console.log(axios);

        axios({
            url: API_BASE_URL + "auth/login/",
            method: "post",
            data: loginReqData
        }).then(({data, status}) => {
            console.log(status);
            console.log("the login promise was done successfully :)");
            localStorage.setItem("token", data.token);
            window.location.href = '/';
        }).catch(err => {
            console.log("well shit >:(");
            displayErrorToast('An account using same email or username is already created');
        });
    }
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

    console.log("addTask is trying his best, don't bully it :(");

    const newTask = document.querySelector("#add-task-input").value;
    console.log(newTask);

    const createTaskData = {
        title: newTask
    };

    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + "todo/create/",
        method: 'post',
        data: createTaskData
    }).then((data, status) => {
        console.log(data, status);
        exports.getTasks();
    }).catch(err => {
        
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

    // console.log(id);
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + `todo/${id}`,
        method: 'delete',
    }).then((data, status) => {
        console.log(data, status);
        displaySuccessToast("The task has been successfully deleted :)");
        exports.getTasks();
    }).catch(err => {
        displayErrorToast("Some error occurred and we could not delete the task :(");
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}

const mainJsExports = {
    setDeleteListeners
}

export default mainJsExports;