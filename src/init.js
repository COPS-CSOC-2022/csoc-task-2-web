import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
let searchbox=document.querySelector("#search-box");
function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    const header={
        'Authorization': `Token ${window.localStorage.getItem('token')}`,
        'Content-Type': "application/json"
    }

    axios({
        url: API_BASE_URL + 'todo/',
        method: 'get',
        headers: header
    }).then(function({data, status}) {
     
        let todo =document.querySelector(".todo-available-tasks")
        todo.innerHTML=`<span class="badge badge-secondary badge-pill todo-available-tasks-text"> Tasks to do </span>`
        for (let element of data){
        todo.innerHTML+=
        `   
            <li class="list-group-item d-flex justify-content-between align-items-center">
                    <input id="input-button-${element.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit your task" value=${element.title}>
                    <div id="done-button-${element.id}"  class="input-group-append hideme">
                        <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(${element.id})">Done</button>
                    </div>
                    <div id="task-${element.id}" class="todo-task">
                        ${element.title}
                    </div>
                    <span id="task-actions-${element.id}">
                        <button style="margin-right:4px;" type="button" onclick="editTask(${element.id})"
                            class="btn btn-outline-warning">
                            <img src="../img/edit.png"
                                width="15px" height="20px">
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${element.id})">
                            <img src="../img/delete.svg"
                                width="15px" height="20px">
                        </button>
                    </span>
            </li>
        `
        }
        searchbox.addEventListener('keyup',search)
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

window.getTasks=getTasks