import axios from 'axios';
import {updateTask, deleteTask, editTask} from './main';
window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.editTask = editTask;

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

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

export function getTasks() {

    axios({
        url: API_BASE_URL + 'todo/',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        method: 'get',
    }).then(function({data, status}) {
        document.getElementById('tasksList').innerHTML = "";
        for(let i=0; i<data.length; i++) {

            let content = `
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
            document.getElementById('tasksList').innerHTML += content;
        }
    })
}
