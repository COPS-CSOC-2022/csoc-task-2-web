import axios from 'axios';
import {editTask, updateTask,deleteTask} from './main';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
var tasks = [];

function getTasks() {
    const TaskData = document.getElementById("TaskData");

    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',

    }).then((data) => {
        TaskData.innerHTML="";
        tasks=data.data;
        Array.from(tasks).forEach((e) => {
            TaskData.innerHTML +=
                `
            <li class="list-group-item d-flex justify-content-between align-items-center">
            <input id="input-button-${e.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${e.id}" class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" id="updateTask-${e.id}" type="button" onclick="updateTask(${e.id})">Done</button>
            </div>
            
            <div id="task-${e.id}" class="todo-task" value=${e.id}>
               ${e.title}
            </div>
            <span id="task-actions-${e.id}">
                <button style="margin-right:5px;" type="button"  
                class="btn btn-outline-warning" onclick="editTask(${e.id})">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
            </button>
            <button type="button" id="deleteBtn-${e.id}" onclick="deleteTask(${e.id})" class="btn btn-outline-danger">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
            </button>
        </span>
        </li>
            `
        })
    }).catch((err) => {
        console.log(err);
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
window.getTasks =getTasks;
