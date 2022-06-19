import axios from 'axios';
import {  deleteTask, editTask, updateTask } from './main';

window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.editTask = editTask;

const taskList = document.getElementById("taskList");

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

export function getTasks() {
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
        for (var i = 0; i < data.length; i++) {
            displayTask(data[i].id, data[i].title);
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
    <li class="list-group-item d-flex justify-content-between align-items-center" class="taskElement" id="taskElement-ID">
        <input id="input-button-ID" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
        <div id="done-button-ID"  class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTaskButtonID" onclick="updateTask(ID)">Done</button>
        </div>
        <div id="task-ID" class="todo-task">
            REPLACE_TITLE
        </div>
        <span id="task-actions-ID">
            <button style="margin-right:5px;" type="button" id="editTaskButtonID" class="btn btn-outline-warning" onclick="editTask(ID)">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="deleteTaskButtonID" onclick="deleteTask(ID)">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px">
            </button>
        </span>
    </li>
    `
    var result1 = template.replace(/ID/g, id);
    var result2 = result1.replace("REPLACE_TITLE", title);

    taskList.innerHTML += result2;
}
