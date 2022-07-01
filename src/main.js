// import axios from '/node_modules/axios';
// const axios = require('axios').default;

function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message,
        timeout: 1500
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message,
        timeout: 1500
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message,
        timeout: 2500
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
    if(username===" " || password===" ") {
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

    const user = document.getElementById('inputUsername').value.trim();
    const pass = document.getElementById('inputPassword').value;

    if(loginFieldsAreValid(user,pass)){
        displayInfoToast("Please wait....");
        const dataForApiRequest = {
            username: user,
            password: pass
        }
        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
            localStorage.setItem('token', data.token)
            window.location.href = '/';
            console.log(localStorage.getItem('token'));
            console.log(data.token);
        }).catch(function(err) {
            console.log(err);
            displayErrorToast('Please enter correct login credentials!!!');
        })
    }
    
}

const regBtn = document.getElementById("registerButton");
if (regBtn)regBtn.onclick = function() {register()};

const logBtn = document.getElementById("loginButton");
if(logBtn) logBtn.onclick = function() {login()};

const logoutBtn = document.getElementById("logoutButton");
if(logoutBtn) logoutBtn.onclick = function() {logout()};

function addTask() {
    
    var taskadded = document.getElementById("taskAdded").value;
    if(taskadded==""){
        displayErrorToast("Please enter a task...");
    }else{
        const dataForApiRequest = {
            title: taskadded
        }
        axios({
            url: API_BASE_URL + 'todo/create/',
            method: 'post',
            data: dataForApiRequest,
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token')
            }
        }).then((data,status) => {
            var tasklist = document.getElementById("taskList");
            getTasks();
        }).catch((err) => {
            console.log(err);
            displayErrorToast("Ooops, something went wrong!!!");
        })
    }
}

const addBtn = document.getElementById("addtask");
if(addBtn) {
    addBtn.onclick = function() {
    addTask();
    document.getElementById("taskAdded").value = "";
    };
}

function editTask(id) {
    document.getElementById('task-' + id).classList.toggle('hideme');
    document.getElementById('task-actions-' + id).classList.toggle('hideme');
    document.getElementById('input-button-' + id).classList.toggle('hideme');
    document.getElementById('done-button-' + id).classList.toggle('hideme');
}


function deleteTask(id) {
    
    const dataForApiRequest = {
        id: id
    }
    axios({
        url: API_BASE_URL + 'todo/'+id+'/',
        method: 'delete',
        data: dataForApiRequest,
        headers: {
            Authorization: 'Token '+localStorage.getItem('token')
        }
    }).then((res,status) => {
        console.log(res);
        getTasks();
        displaySuccessToast("Todo deleted successfully....");
    }).catch((err) => {
        displayErrorToast("Ooops, something went wrong, Try again...");
    })
}

function updateTask(id) {

    const taskUpdated = document.getElementById("input-button-"+id).value;
    const dataForApiRequest = {
        id: id,
        title: taskUpdated
    }
    axios({
        url: API_BASE_URL + 'todo/'+id+'/',
        method: 'patch',
        data: dataForApiRequest,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then((response,status) => {
        console.log(response);
        document.getElementById("task-"+id).innerHTML = taskUpdated;
        editTask(id);
    })
}

window.editTask = editTask;
window.updateTask = updateTask;
window.deleteTask = deleteTask;

const search = document.getElementById("searchtag");

function searchtask() {
    document.getElementById("input-button").classList.toggle('hideme');
    document.getElementById("input-button").style.maxWidth = "150px"
    document.getElementById("done-button").classList.toggle('hideme');
    search.classList.add('hideme');
}

window.searchtask = searchtask;

const searchbtn = document.getElementById("searchBtn");
function searchButton() { 
    var list = document.getElementsByClassName("list-group-item")
    var todos = document.getElementsByClassName("todo-task");  
    console.log(todos); 
    const searchinput = document.getElementById("input-button").value;
    if(searchinput==""){
        displayErrorToast("Please enter a task.");
    }
    else{
        var check=1;
        for(let i=0; i<todos.length; i++){
            var title = todos[i].innerText;
            console.log(searchinput);
            if(title==searchinput){
                check=0;
                const bg = "rgb(245, 206, 66)";
                const white = "#ffffff";
                console.log(todos[i]);
                console.log(list[i]);
                list[i].style.backgroundColor = bg;
                setTimeout(function() {
                    list[i].style.backgroundColor = white;
                },2000);
            }
        }
        if(check==1){
            displayErrorToast("Sorry :(, entered task not found.");
        }
    }
    document.getElementById("input-button").value = "";
}

window.searchButton = searchButton;

const searchinput = document.getElementById("input-button");

if(searchinput){
    searchinput.addEventListener("focusout", function() {
        search.classList.remove('hideme');
        searchinput.classList.add('hideme');
        document.getElementById("done-button").classList.add('hideme');
    })
}
