import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

window.getTasks = function() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get'
    }).then(function({data,status}){
        console.log(data);
        document.getElementById('taskList').innerHTML = "";
        for(var i = 0; i < data.length ; i++ )
        displayItems(data[i].id,data[i].title);
    })
}

window.displayItems = function(id,title){
    var temp = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
    <input id="input-button-${id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
    <div id="done-button-${id}"  class="input-group-append hideme">
        <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(${id})">Done</button>
    </div>
    <div id="task-${id}" class="todo-task">
        ${title}
    </div>

    <span id="task-actions-${id}">
        <button style="margin-right:5px;" type="button" onclick="editTask(${id})"
            class="btn btn-outline-warning">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px" height="20px">
        </button>
        <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${id})">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px" height="22px">
        </button>
    </span>
    </li>
    `
    document.getElementById('taskList').innerHTML += temp;
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
