import axios from 'axios';
import { getTasks } from "./init";
const loginbtn=document.querySelector("#loginButton");
if(loginbtn) loginbtn.addEventListener("click",login);

const registerbtn=document.querySelector("#registerButton");
if(registerbtn) registerbtn.addEventListener("click",register);

const logoutbtn=document.querySelector("#logoutButton");
if(logoutbtn) logoutbtn.addEventListener("click",logout);

const addtaskbtn=document.querySelector('#addTaskButton');
if(addtaskbtn) addtaskbtn.onclick = addTask;

const searchtaskbtn=document.querySelector('#searchTaskButton');
if(searchtaskbtn) searchTaskButton.onclick = searchTask;

// const deletetaskbtn=document.querySelector("#loginButton");
// if(deletetaskbtn) deletetaskbtn.addEventListener("click",login);

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

function logout() 
{
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

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) 
    {
        console.log("hiuo");
        displayInfoToast("Please wait...");
        
        console.log("hiuo22");
        const dataForApiRequest =
         {
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

     const username = document.getElementById('inputUsername').value.trim();
     const password = document.getElementById('inputPassword').value;
     if (username == '' || password == '') 
     {
        displayErrorToast("Username and Password cannot be empty.");
        return;
    }

    displayInfoToast("Loading...");

    axios({
        url: API_BASE_URL + "auth/login/",
        method: "post",
        data: { username, password }
    })
    .then(function ({ data, status }) {
        displaySuccessToast("Logged in Successfully...");
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    }).catch(function (err) {
        displayErrorToast("Please check your credentials.");
  
    })
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

    const wride=document.getElementById('entervalue');
    const write = document.getElementById('entervalue').value.trim();

     if (write == '') 
     {
         displayErrorToast("It cannot be empty");
         return;
     }

     axios({
        headers: 
        {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/create/",
        method: "post",
        data: { title: write }
    })
    .then(function (response) {
      
        // fetchTask(wride);
        displaySuccessToast("Task Added Successfully");
        getTasks();
        wride.value = "";
    })
    .catch(function (err) {
        displayErrorToast("Hello error chexk!");
    });
}

function searchTask() {
    // const wrie=document.getElementById('entervalue');
    const sevalue = document.getElementById('searchvalue').value.trim();

     if (sevalue == '') 
     {
         displayErrorToast("It cannot be empty");
         return;
     }
     displayInfoToast("Searching..");
     axios({
        headers: 
        {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/",
        method: "GET",
        // data: { title: write }
    })
    .then(function ({data,status}) {
      
        // fetchTask(wride);
        console.log(data);
        // document.getElementById(`todo-${data[1].id}`).style.backgroundColor="blue";
        var flag=0;
        for(var i=0;i<data.length;i++)
        {
            if(data[i].title ==sevalue)
            {
                displaySuccessToast("Search done Successfully");
                flag++;
                document.getElementById(`todo-${data[i].id}`).style.background="green";
                console.log(`todo-${data[i].id}`);
                console.log("dd");
            }
        }
        if(flag==0)
        {
            displayErrorToast("No searches avilable!!");
        }
    })

}

// function fetchTask(ff)
// {
//     axios({
//         headers: 
//         {
//             Authorization: "Token " + localStorage.getItem("token")
//         },
//         url: API_BASE_URL + "todo/",
//         method: "get"
//     })
//     .then(function ({ data, status }) {
//         createTask(data[data.length - 1]); 
//         displaySuccessToast("Task Added Successfully");
//     })
//     .catch(err => {
//         displayErrorToast("We are unable to process the request. Try Again Later");
//     });
// }

function editTask(id) 
{
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

     displayInfoToast("Please wait...");

      axios({
        headers:
        {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/" + id + "/",
                 method: "DELETE",
        //  data: dataForApiRequest,
     }).then(function({data, status}) {
        document.querySelector(`#todo-${id}`).remove();
        displaySuccessToast("Task deleted Successfully!");
     }).catch(function(err) {
       displayErrorToast('Try again!! Process failed.');
     })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
     const updateText = document.getElementById("input-button-" + id).value;
     const todoText = document.getElementById(`task-${id}`).innerText.trim();
     if (updateText === "")
      { 
        displayErrorToast("Empty not allowed!");
        return; 
    }
     if (updateText === todoText)                 
     {
         document.getElementById("task-" + id).classList.toggle("hideme");
         document.getElementById("task-actions-" + id).classList.toggle("hideme");
         document.getElementById("input-button-" + id).classList.toggle("hideme");
         document.getElementById("done-button-" + id).classList.toggle("hideme");
         displaySuccessToast("Task Updated Successfully");
         return ;
     }
     axios({
         headers: {
             Authorization: "Token " + localStorage.getItem("token")
         },
         url: API_BASE_URL + "todo/" + id + "/",
         method: "patch",
         data: { title: updateText }
     })
     .then(function ({ data, status }) {
         document.getElementById("task-" + id).classList.toggle("hideme");
         document.getElementById("task-actions-" + id).classList.toggle("hideme");
         document.getElementById("input-button-" + id).classList.toggle("hideme");
         document.getElementById("done-button-" + id).classList.toggle("hideme");
         document.getElementById("task-" + id).innerText = updateText;
         displaySuccessToast("Task Updated Successfully");
     })
     .catch(function (err) {
         displayErrorToast("We are unable to process the request. Please try again later!");
     });
}


function createTask(todo) {
    const tasksContainer = document.querySelector('.todo-available-tasks');
    const newNode = document.createElement("li");
    newNode.innerHTML =
        `
            <input id="input-button-${todo.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${todo.id}"  class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${todo.id}">Done</button>
            </div>
            <div id="task-${todo.id}" class="todo-task">
                ${todo.title}
            </div>
            
            <span id="task-actions-${todo.id}">
                <button style="margin-right:5px;" type="button" id="edit-task-${todo.id}"
                class="btn btn-outline-warning">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
                </button>
                
                <button type="button" class="btn btn-outline-danger" id="delete-task-${todo.id}">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>
    `;
    newNode.id = `todo-${todo.id}`;
    newNode.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    tasksContainer.appendChild(newNode);

    document.querySelector(`#edit-task-${todo.id}`)
        .addEventListener("click", () => editTask(todo.id));
    document.querySelector(`#update-task-${todo.id}`)
        .addEventListener("click", () => updateTask(todo.id));
    document.querySelector(`#delete-task-${todo.id}`)
        .addEventListener("click", () => deleteTask(todo.id));
    document.getElementById("input-button-" + todo.id).value = todo.title;
}

export { createTask } ;