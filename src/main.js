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

     const username = document.getElementById('inputUsername').value.trim();
     const password = document.getElementById('inputPassword').value;

    // Checking validation

    if (username === '' || password === '') {
        displayErrorToast("Do not use empty fields!");
        return;
    }
     const dataForApiRequest = {
        username: username,
        password: password
    }
    
    //fetching auth token from backend

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'POST',
        data: dataForApiRequest,
    }).then(function({data, status}) {
      window.localStorage.setItem("token",data.token);
      window.location.href = '/';
      displaySuccessToast('Login was successful!!')
    }).catch(function(err) {
      displayErrorToast('Invalid credentials! :(');
    })
}

function addTask() {
    
    const newtask = document.getElementById("new-inp-task").value;

    const dataForNewTask = {
        title: newtask.trim()
    }
    axios({
        url: API_BASE_URL + 'todo/create/',
        method: 'POST',
        headers: {
            'Authorization': `token ${localStorage.getItem('token')}`,
            'Content-Type': "application/json"
        },
        data: dataForNewTask
    }).then(() => {
        getTasks();
        document.getElementById("new-inp-task").value='';
        document.getElementById("new-inp-task").placeholder="Enter Task";
        displaySuccessToast('Task added successfully!');
    }).catch(function(err) {
        displayErrorToast("There was an error! Try again!");
    })
}

function searchTask() {

    const search = document.getElementById('search-task').value.trim();

    if(!search) {
        displayErrorToast("Task cannot be empty!");
    }
    else {

        axios({
            url: API_BASE_URL + 'todo/',
            method: 'get',
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            }
        }).then(function({data, status}) {

            for(let i=0; i<data.length; i++) {
                if(data[i].title == search) {

                    displaySuccessToast("Yay!! Task Found!");
                    document.getElementById('search-task').value = null;
                    
                    document.getElementById('list-of-todos').innerHTML = 
                    `
                    <li class="list-group-item d-flex justify-content-between align-items-center" class="taskElement" id="taskElement-${data[i].id}">
                    <input id="input-button-${data[i].id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                    <div id="done-button-${data[i].id}"  class="input-group-append hideme">
                    <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTaskButton${data[i].id}" onclick="updateTask(${data[i].id})">Done</button>
                    </div>
                    <div id="task-${data[i].id}" class="todo-task">
                    ${data[i].title}
                    </div>
                    <span id="task-actions-${data[i].id}">
                    <button style="margin-right:5px;" type="button" id="editTaskButton${data[i].id}" class="btn btn-outline-warning" onclick="editTask(${data[i].id})">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px">
                    </button>
                    <button type="button" class="btn btn-outline-danger" id="deleteTaskButton${data[i].id}" onclick="deleteTask(${data[i].id})">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px">
                    </button>
                    </span>
                    </li>
                    `
                    ;
                    return;
                }
            }
            document.getElementById('search-task').value = null;
            displayErrorToast("There do not exist such task! :(");
        }).catch(function(err) {
            document.getElementById('search-task').value = null;
            displayErrorToast("There was an error! Try again!");
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

    if(confirm("Are you sure you want to delete this task?")) {

        axios({
            url: API_BASE_URL + `todo/${id}/`,
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('token')}`,
                'Content-Type': "application/json"
            }
        }).then(() => {
            displaySuccessToast("Task Deleted Succesfully!")
            getTasks();
        }).catch(function(err) {
            displayErrorToast("There was an error! Try again!");
        })
    }
}

function updateTask(id) {
    const updatedTask=document.getElementById(`input-button-${id}`).value;

    if(updatedTask==="") displayErrorToast("Cannot be a null string!"); 
    else{
        axios({
            url: API_BASE_URL + `todo/${id}/`,
            method: 'PUT',
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('token')}`,
                'Content-Type': "application/json"
            },
            data: {title: updatedTask}
        }).then(() => {
            getTasks();
            displaySuccessToast('Task updated successfully!')
        }).catch(function(err) {
            displayErrorToast("There was an error! Try again!");
        })
    }
    

}

window.register=register;
window.login=login;
window.logout=logout;
window.addTask=addTask;
window.searchTask=searchTask;
window.editTask=editTask;
window.updateTask=updateTask;
window.deleteTask=deleteTask;
