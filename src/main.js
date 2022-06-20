import axios from 'axios';
const loginBtn =document.getElementById('login-btn');
if(loginBtn)
{
    loginBtn.addEventListener('click',login);
}
const registerBtn =document.getElementById('register-btn');
if(registerBtn)
{
    registerBtn.addEventListener('click',register);
}
const logoutBtn =document.getElementById('logout-btn');
if(logoutBtn)
{
    logoutBtn.addEventListener('click',logout);
}
const addTaskBtn =document.getElementById('addTask-btn');
if(addTaskBtn)
{
    addTaskBtn.addEventListener('click',addTask);
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
function loginFieldsAreValid(username, password) {
    if (username === '' || password === '') {
        displayErrorToast("Please fill all the credentials");
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
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend, login and direct user to home page.
     */
     const username = document.getElementById("inputUsername").value.trim();
     const password = document.getElementById("inputPassword").value;
     if(loginFieldsAreValid(username,password))
     {
        const logindata = {username: username , password: password};
        axios({
            url : API_BASE_URL + "auth/login/",
            data: logindata,
            method: 'post',
        }).then(function (response){
            const {data,status}= response;
            localStorage.setItem('token',data.token);
            window.location.href = '/';
        }).catch(function (error){
            displayErrorToast("Please Recheck Your Credentials")
        })
     }

}

export function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const taskTitle = document.querySelector(".todo-add-task input").value.trim();
    axios({
        headers : {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/create/",
        data: {title: taskTitle},
        method:'POST',

    }).then((res)=>{
        getTasks();
        displaySuccessToast("SuccessFully Added the task");
    }).catch((error)=>{
        console.log(error);
        displayErrorToast("Sorry!! Your Task couldn't be added");
    })
}

export function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

export function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
     axios({
        url:API_BASE_URL+`todo/${id}/`,
        headers:{
            Authorization:'Token '+localStorage.getItem('token')

        } ,
        method: 'DELETE',
    }).then((res)=>{
        getTasks();
       displaySuccessToast("SuccessFully Deleted the tasks")
    }).catch((e)=>{
        displayErrorToast(e)
    })
}

export function updateTask(id) {
    /**
     * @todo Complete this function.-ll/
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     const updTask = document.getElementById(`input-button-${id}`).value;
     if(updTask){
         axios({
             headers: {Authorization: "Token " + localStorage.getItem("token")},
             url: API_BASE_URL + `todo/${id}/`,
             method: 'patch',
             data: {title: updTask}
         }).then(({data,status})=>{
            displaySuccessToast("Task updated successfully")
            getTasks();
         }).catch((err)=>{
             displayErrorToast("Opps!!!Try Again")
         })
     }
}
window.addTask =addTask;
window.deleteTask=deleteTask;
window.editTask=editTask;
window.updateTask=updateTask;
