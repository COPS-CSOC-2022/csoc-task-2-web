import axios from 'axios';

import { updateTask, deleteTask, editTask } from './main';

window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.editTask = editTask;

const taskList=document.querySelector("#todoTaskList");

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';




export function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
     const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }
     axios({
        headers: headersForApiRequest,
        url: API_BASE_URL + 'todo/',
        method: 'GET',
    }).then(function ({ data, status }) {
        console.log(data);
        taskList.innerHTML = "";
        for (var ind = 0; ind < data.length; ind++) {
            displayTask(data[ind].id, data[ind].title);
        }
    })
}

axios({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'get',
}).then(function({data, status}) {
  document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
  document.getElementById('profile-name').innerHTML = data.name;
  getTasks();
})

export function displayTask(id, title) {
    
    var template = `
    <li class="list-group-item d-flex justify-content-between align-items-center" class="taskElement" id="taskElement-UNIQUE_ID">
        <input id="input-button-UNIQUE_ID" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
        <div id="done-button-UNIQUE_ID"  class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTaskButtonUNIQUE_ID" onclick="updateTask(UNIQUE_ID)">Done</button>
        </div>
        <div id="task-UNIQUE_ID" class="todo-task">
            UNIQUE_TASK_TITLE
        </div>
        <span id="task-actions-UNIQUE_ID">
            <button style="margin-right:5px;" type="button" id="editTaskButtonUNIQUE_ID" class="btn btn-outline-warning" onclick="editTask(UNIQUE_ID)">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="deleteTaskButtonUNIQUE_ID" onclick="deleteTask(UNIQUE_ID)">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px">
            </button>
        </span>
    </li>
    `
    var initialTemplate = template.replace(/UNIQUE_ID/g, id);
    var finalTemplate = initialTemplate.replace("UNIQUE_TASK_TITLE", title);

    taskList.innerHTML += finalTemplate;

}


