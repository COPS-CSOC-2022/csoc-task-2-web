import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    fetch(API_BASE_URL+'todo/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Token ${localStorage.token}`,  
        },
        mode: 'cors',
        method: 'GET'
    })
    .then(response => response.json())
    .then(function(data){
        
        let listOfTodos = document.getElementById('listOfTodos');
        listOfTodos.innerHTML = `<span class="badge badge-primary badge-pill todo-available-tasks-text">Available Tasks</span>`
        
        for(let entry of data){
            listOfTodos.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
                <input id="input-button-${entry.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                <div id="done-button-${entry.id}"  class="input-group-append hideme">
                    <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(${entry.id})">Done</button>
                </div>
                <div id="task-${entry.id}" class="todo-task">
                    ${entry.title}
                </div>

                <span id="task-actions-${entry.id}">
                    <button style="margin-right:5px;" type="button" onclick="editTask(${entry.id})"
                        class="btn btn-outline-warning">
                        <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                            width="18px" height="20px">
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${entry.id})">
                        <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                            width="18px" height="22px">
                    </button>
                </span>
            </li>`;
        }
    })
    .catch(err => console.log(err));


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

window.getTasks = getTasks;