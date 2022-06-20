import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

export function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
        */  
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
    })
    .then(function({data, status}){
        const list = document.getElementById('tasks_Available');
        list.innerHTML="";
        for(var i=0; i<data.length(); i++){
            const curr_ele = data[i];

            list.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                        <input id="input-button-${curr_ele.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                        <div id="done-button-${curr_ele.id}"  class="input-group-append hideme">
                            <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(${curr_ele.id})">Done</button>
                        </div>
                        <div id="task-${curr_ele.id}" class="todo-task">
                        ${curr_ele.title}
                        </div>
                        <span id="task-actions-${curr_ele.id}">
                            <button style="margin-right:5px;" type="button" onclick="editTask(${curr_ele.id})"
                                class="btn btn-outline-warning">
                                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                                    width="18px" height="20px">
                            </button>
                            <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${curr_ele.id})">
                                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                                    width="18px" height="22px">
                            </button>
                        </span>
                </li>`;
        }
    })
    .catch(function(err){
        displayErrorToast("Please Try Again!!")
    })
}
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'auth/profile/',
        method: 'get',
    })
    .then(function({data, status}) {
    document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
    document.getElementById('profile-name').innerHTML = data.name;
    getTasks();
    })
