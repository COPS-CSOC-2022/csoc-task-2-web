import axios from 'axios';
import { updateTask, deleteTask, editTask } from './main';

window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.editTask = editTask;

const taskList = document.getElementById("taskList");
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

axios({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'get',
}).then(function ({ data, status }) {
    document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
    document.getElementById('profile-name').innerHTML = data.name;
    getTasks();
})

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
        for (var index = 0; index < data.length; index++) displayTask(data[index].id, data[index].title);
    })
}


export function displayTask(id, title) {
    
    var template = `
    <li class="list-group-item d-flex justify-content-between align-items-center" class="taskElement" id="taskElement-REPLACE_ID">
        <input id="input-button-REPLACE_ID" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
        <div id="done-button-REPLACE_ID"  class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" id="updateTaskButtonREPLACE_ID" onclick="updateTask(REPLACE_ID)">Done</button>
        </div>
        <div id="task-REPLACE_ID" class="todo-task">
            REPLACE_TASK_TITLE
        </div>

        <span id="task-actions-REPLACE_ID">
            <button style="margin-right:5px;" type="button" id="editTaskButtonREPLACE_ID" class="btn btn-outline-warning" onclick="editTask(REPLACE_ID)">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" id="deleteTaskButtonREPLACE_ID" onclick="deleteTask(REPLACE_ID)">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px">
            </button>
        </span>
    </li>
    `
    var result1 = template.replace(/REPLACE_ID/g, id);
    var result2 = result1.replace("REPLACE_TASK_TITLE", title);

    taskList.innerHTML += result2;
}