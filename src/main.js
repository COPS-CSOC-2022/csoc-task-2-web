import axios from 'axios';
var editValue;
let regBtn=document.getElementById('register')
let loginBtn=document.getElementById('login')
let logoutBtn=document.getElementById('logout')
let addBtn=document.getElementById('add')
let searchValue=document.getElementById('searchValue')
let searchBtn=document.getElementById('search')
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




if (localStorage.getItem("token")) {
    logoutBtn.addEventListener('click',logout);
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
    displaySuccessToast('Logged out successfully')
}


if(regBtn) {

    regBtn.addEventListener('click',register);
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
        }).then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}


if(loginBtn) {

    loginBtn.addEventListener('click',login);
}

function login() {
    const user = document.getElementById('inputUsername').value.trim();
    const pwd = document.getElementById('inputPassword').value;

    if (user == '' || pwd == '') {
        displayErrorToast(`Username or Password can't remain empty`);
        return;
    }

    displayInfoToast('Please wait...');

    const dataForApiRequest = {
        username: user,
        password: pwd
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'POST',
        data: dataForApiRequest,
    }).then( ({ data, status })=> {
        displaySuccessToast('Login was Successful');
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }).catch(function (err) {
        displayErrorToast('Invalid credentials!');
        document.getElementById('inputUsername').value = '';
        document.getElementById('inputPassword').value = '';
    })
    
}

if(localStorage.getItem('token')&&addBtn){
    addBtn.onclick = addTask;
}

function addTask() {
    const newTask = document.getElementById('newTask').value.trim();
    if (newTask.length===0) {
        displayErrorToast("Please enter non-empty task!")
        return;
    }
    displaySuccessToast('Added new Task')
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/create/",
        method: "post",
        data: { title: newTask }
    })
        .then((res)=>{
            axios({
                headers: {
                    Authorization: "Token " + localStorage.getItem("token")
                },
                url: API_BASE_URL + "todo/",
                method: "get"
            }).then(function ({ data, status }) {
                const newtask = data[data.length - 1];
                const taskId = newtask.id;
                addNew(newTask, taskId)
            });
        })
        .catch((err)=>{
            console.log(err)
            displayErrorToast("Error found while adding!");
        });

        document.getElementById('added-task').value='';
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/" + id + "/",
        method: "delete"
    })
        .then(({ data, status })=>{
            document.querySelector(`#todo-${id}`).remove();
            displaySuccessToast("Task Deleted");
            console.log("Task Deleted !")
        })
        .catch((err)=>{
            console.log(err)
            displayErrorToast("Error found!");
        });
}

function updateTask(id) {
    let taskBtn = document.getElementById("task-actions-" + id);
    let update = document.getElementById("input-button-" + id);
    let updateBtn = document.getElementById("done-button-" + id);
    let task = document.getElementById("task-" + id);

   let valueNew= update.value;
     displaySuccessToast("Task Updated");

     if (!valueNew) 
     {
         return;
     }

     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/" + id + "/",
         method: "patch",
         data: { title: valueNew }
     })
         .then(({ data, status })=> {
             task.classList.remove("hideme");
             taskBtn.classList.remove("hideme");
             update.classList.add("hideme");
             updateBtn.classList.add("hideme");
             task.innerText = valueNew;
             
             
         })
         .catch((err)=>{
             console.log(err)
             displayErrorToast("An error occurred");
             task.classList.remove("hideme");
             taskBtn.classList.remove("hideme");
             update.classList.add("hideme");
             updateBtn.classList.add("hideme");
         });
}

export default function addNew(addedTask, taskId){
    const availableTasks = document.querySelector(".todo-available-tasks");
    const newEntryTask = document.createElement("li");
    newEntryTask.innerHTML = `
        <input id="input-button-${taskId}" type="text" class="form-control todo-edit-task-input hideme"  placeholder="Edit The Task">
        <div id="done-button-${taskId}" class="input-group-append hideme">
            <button class="btn btn-outline-primary todo-update-task" type="button" id="updateTaskBtn-${taskId}">Done</button>
        </div>
    
        <div id="task-${taskId}" class="todo-task">
            ${addedTask}
        </div>
        <span id="task-actions-${taskId}">
            <button style="margin-right:5px;" type="button" id="editTaskBtn-${taskId}"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="deleteTaskBtn-${taskId}">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>`;
    
    newEntryTask.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
    );
    
    availableTasks.appendChild(newEntryTask);
    newEntryTask.id = `todo-${taskId}`;

    document.querySelector(`#editTaskBtn-${taskId}`).addEventListener("click", () => editTask(taskId));
    document.querySelector(`#updateTaskBtn-${taskId}`).addEventListener("click", () => updateTask(taskId));
    document.querySelector(`#deleteTaskBtn-${taskId}`).addEventListener("click", () => deleteTask(taskId));
    document.getElementById("input-button-" + taskId).value = addedTask;
 };

 if(searchBtn){
searchBtn.onclick=searchTask;
 }

 function searchTask(){
    let serVal=searchValue.value.trim();
    if (serVal.length===0) {
        displayErrorToast("Search can't be empty!");
        return;
    }
        displayInfoToast('Searching...');
        axios({
            method: 'get',
            url: API_BASE_URL + 'todo/',
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token')
            }
        }).then( ({ data,status })=> {
            console.log(data);
            for(var i=0;i<data.length;i++){
               var Tid=data[i].id;
            if(data[i].title.toLowerCase().includes(serVal.toLowerCase())){
                document.getElementById(`task-${Tid}`).style.color='red';
                document.getElementById(`task-${Tid}`).style.fontSize='2rem';
                displaySuccessToast('Task found');
            }
            else{
                if( document.getElementById(`task-${Tid}`).style.color='red'){
                    document.getElementById(`task-${Tid}`).style.color='black';
                    document.getElementById(`task-${Tid}`).style.fontSize='1rem';
                }
            }
           }
        }
        ).catch((err)=>{
            console.log(err);
            displayErrorToast('Error searching tasks');
        }
        )
 }
