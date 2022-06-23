import axios from 'axios';
export {editTask};
export {deleteTask};
export {updateTask};
export {TodoDisplayer}
const loginbtn = document.getElementById("login-btn")
if(loginbtn)
    loginbtn.addEventListener('click',login)

const regbtn = document.getElementById("register-btn")
if(regbtn)
    regbtn.addEventListener('click',register)

const logoutbtn = document.getElementById("log-out-btn")
if(logoutbtn)
    logoutbtn.addEventListener('click',logout)

const addtaskbtn = document.getElementById("add-task-btn")
if(addtaskbtn)
    addtaskbtn.addEventListener('click',addTask)

const searchtaskbtn = document.getElementById("search-task-btn")
if(searchtaskbtn)
    searchtaskbtn.addEventListener('click',searchTask)

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
    localStorage.removeItem('Token');
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
    const password2 = document.getElementById('inputPassword2').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        if(password===password2){
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
            localStorage.setItem('Token', data.token);
            window.location.href = '/';
            }).catch(function(err) {
            displayErrorToast('An account using same email or username is already created');
            })
        }
        else{
            displayErrorToast("Password Not Matching.....");
        }
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
    if(loginFieldsAreValid(username,password)){
        const credentials = {username: username , password: password};
        axios({
            url : API_BASE_URL + "auth/login/",
            method: "post",
            data: credentials,
        }).then(function (response){
            const {data,status}= response;
            localStorage.setItem("Token",data.token);
            window.location.href = '/';
        }).catch(function (error){
            displayErrorToast("Oops!!! Try Again.")
        })
    }
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const task_title = document.querySelector(".todo-add-task input").value.trim();

    if(String(task_title).length==0){
        displayErrorToast("Enter a task!")
        return;
    }
 
    axios({
        headers : {
            Authorization: "Token " + localStorage.getItem("Token")
        },
        url: API_BASE_URL + "todo/create/",
        method: "post",
        data: {title: task_title}
 
    }).then((res)=>{
        axios({
            headers : {
                Authorization: "Token " + localStorage.getItem("Token")
            },
            url: API_BASE_URL + "todo/",
            method: "get"
        }).then(({data,status})=>{
            const newTaskid = data[data.length-1].id;
            TodoDisplayer(newTaskid,task_title);
 
        }).catch((error)=>{
            console.log(error);
            displayErrorToast("OOPS!!!Something Weird Happend");
        })
    })
 
}
 
function TodoDisplayer(newTaskid,task_title){
    const element = document.createElement("li");
    element.classList.add("list-group-item","d-flex","justify-content-between","align-items-center");
    element.id = `todo-${newTaskid}`;
    element.innerHTML = ` <input id="input-button-${newTaskid}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
    <div id="done-button-${newTaskid}"  class="input-group-append hideme">
        <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTask-${newTaskid}">Done</button>
    </div>
    <div id="task-${newTaskid}" class="todo-task">
        ${task_title}
    </div>
    <span id="task-actions-${newTaskid}">
        <button style="margin-right:5px;" type="button" id="editTask-${newTaskid}"
            class="btn btn-outline-warning">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
        </button>
        <button type="button" class="btn btn-outline-danger" id="deleteTask-${newTaskid}">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
        </button>
    </span>`;
    const oldRecord = document.querySelector(".todo-available-tasks");
    oldRecord.appendChild(element);
    document.getElementById(`input-button-${newTaskid}`).value = task_title;
    document.getElementById(`updateTask-${newTaskid}`).addEventListener('click',()=>{updateTask(newTaskid)});
    document.getElementById(`deleteTask-${newTaskid}`).addEventListener('click',()=>{deleteTask(newTaskid)});
    document.getElementById(`editTask-${newTaskid}`).addEventListener('click',()=>{editTask(newTaskid)});
    document.querySelector(".todo-add-task input").value="";
 
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
     axios({
        headers : {Authorization : "Token " + localStorage.getItem("Token")},
        url: API_BASE_URL + `todo/${id}/`,
        method: "delete"
    }).then(({data,status})=>{
        document.getElementById(`todo-${id}`).remove();
    }).catch((err)=>{
        displayErrorToast("Sorry for the trouble!!!");
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     const updTask = document.getElementById(`input-button-${id}`).value;
    if(updTask){
        axios({
            headers: {Authorization: "Token " + localStorage.getItem("Token")},
            url: API_BASE_URL + `todo/${id}/`,
            method: "patch",
            data: {title: updTask}
        }).then(({data,status})=>{
            document.getElementById('task-' + id).classList.remove('hideme');
            document.getElementById('task-actions-' + id).classList.remove('hideme');
            document.getElementById('input-button-' + id).classList.add('hideme');
            document.getElementById('done-button-' + id).classList.add('hideme');
            document.getElementById('task-'+id).innerHTML = updTask;
        }).catch((err)=>{
            displayErrorToast("Opps!!!Try Again")
        })
    }
}

function searchTask(){
    const searchString = document.querySelector(".todo-search-task input").value.trim();
    axios({
        headers: {Authorization: "Token " + localStorage.getItem("Token")},
        url: API_BASE_URL + `todo/`,
        method: "get"
    }).then(({data,status})=>{
        document.querySelector(".todo-search-task input").value="";
        for(let i=0 ; i<data.length ; i++){
            if(data[i].title===searchString){
                const id = data[i].id;
                displaySuccessToast(`Id:${id}
                Todo: ${searchString}`);
                return
            }
        }
        if(i==data.length){
        displayErrorToast(":( Not found");
        }
    }).catch((err)=>{
        displayErrorToast(":( Not found");
    })

}
