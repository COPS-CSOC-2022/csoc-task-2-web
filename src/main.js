import axios from 'axios';
import { getTasks } from './init.js';
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
// const logout = document.getElementById("logout");
function logout(){
    window.localStorage.removeItem('token');
    window.location.href = '/login/';
    alert("Logged out");
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
            data: dataForApiRequest
        }).then(function({data, status}) {
          window.localStorage.setItem('token', data.token);
          window.location.href = '/';
          displaySuccessToast(`Registered as ${username}`);
        }).catch(function(err){
          displayErrorToast('An account using same email or username is already created');
        })
    }
}
  /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend, login and direct user to home page.
     */
     function login() {
    const username =document.getElementById('inputUsername').value;
    const password = document.getElementById('inputPassword').value;
        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: {
                username:username,
                password:password
            }
        }).then(({data})=> {
          window.localStorage.setItem('token', data.token);
          window.location.href = '/';
          alert(`Logged in as ${username}`);
        }).catch(function(err){
          displayErrorToast('Invalid Username or Password');
        })
    }
   
export function addTask() {
    const newTask = document.getElementById('newTask').value;
    axios({
        url:API_BASE_URL + 'todo/create/',
            method:'post',
            data:{
                title:newTask
            },
            headers:{
                Authorization:`Token ${window.localStorage.getItem('token')}`
            }
    }).then((data)=>{
        document.getElementById('newTask').value = "";
        getTasks();
        displaySuccessToast("New Task added");
    }).catch((err)=>{
        displayErrorToast("Task couldn't be added");
    })
};

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
    axios({
        method:'DELETE',
        url:API_BASE_URL+`todo/${id}`,
        headers:{
            Authorization:`Token ${window.localStorage.getItem('token')}`
        }
    }).then(({})=>{
        getTasks();
        displaySuccessToast("Deleted Succesfully")
    }).catch((err)=>{
        displayErrorToast("Couldn't delete the task");
    });
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const inputButton = document.getElementById(`input-button-${id}`);
    axios({
        method:'patch',
        url:API_BASE_URL+`todo/${id}/`,
        data:{
            id : id,
            title : inputButton.value
        },
        headers:{
            Authorization : `Token ${window.localStorage.getItem('token')}`
        }
    }).then(({data})=>{
        document.getElementById('task-' + id).classList.remove('hideme');
        document.getElementById('task-actions-' + id).classList.remove('hideme');
        document.getElementById('input-button-' + id).classList.add('hideme');
        document.getElementById('done-button-' + id).classList.add('hideme');
        getTasks();
        displaySuccessToast("Task updated")
    })
}
window.editTask=editTask
window.deleteTask=deleteTask
window.updateTask=updateTask
window.addTask=addTask
window.logout=logout;
window.login=login;
window.register=register;