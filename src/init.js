// import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'), 
        },
        url: API_BASE_URL + 'todo/',
        method: 'get'
    }).then((data,status) => {
        const todos = data.data;
        var tasklist = document.getElementById("taskList");
        tasklist.innerHTML = `
        <span class="badge badge-primary badge-pill todo-available-tasks-text">
            Available Tasks
        </span>`;
        console.log(todos);
        todos.map((todo) => {
            var title = todo.title;
            var index = todo.id;
            console.log(title);
            var content = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <input id="input-button-${index}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                <div id="done-button-${index}"  class="input-group-append hideme">
                    <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(${index})">Done</button>
                </div>
                <div id="task-${index}" class="todo-task">
                    ${title}
                </div>

                <span id="task-actions-${index}">
                    <button id="editButton-${index}" style="margin-right:5px;" type="button" onclick="editTask(${index})"
                        class="btn btn-outline-warning">
                        <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                            width="18px" height="20px">
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${index})">
                        <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                            width="18px" height="22px">
                    </button>
                </span>
            </li>`
            tasklist.innerHTML += content;
            
        })
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

window.getTasks = function() { getTasks()};
