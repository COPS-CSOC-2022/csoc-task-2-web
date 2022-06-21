import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

const tasks = document.getElementById("tasks");

export function getTasks() {
    const headersForApiRequest = {
        Authorization: 'Token ' + localStorage.getItem('token')
    }

    axios({
        url:API_BASE_URL + "todo/",
        method:"get",
        headers:{
            Authorization:"Token "+localStorage.getItem("token")
        }        

    })
    .then(function({data})
    {
        tasks.innerHTML = "";
        data.forEach((task) => newTask(task));
    })
    
};

const newTask = (task) => {
    const newElement = document.createElement('li');
    newElement.innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <input id="input-button-${task.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                    <div id="done-button-${task.id}"  class="input-group-append hideme">
                        <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${task.id}">Done</button>
                    </div>
                    <div id="task-${task.id}" class="todo-task">
                        ${task.title}
                    </div>

                    <span id="task-actions-${task.id}">
                        <button style="margin-right:5px;" type="button" id="edit-task-${task.id}"
                            class="btn btn-outline-warning">
                            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                                width="18px" height="20px">
                        </button>
                        <button type="button" class="btn btn-outline-danger" id = "delete-task-${task.id}">
                            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                                width="18px" height="22px">
                        </button>
                    </span>
            </li>`;
            newElement.id = `todo-${task.id}`;
            newElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            tasks.appendChild(newElement);
        
            document.querySelector(`#edit-task-${task.id}`)
                .addEventListener("click", () => editTask(task.id));
            document.querySelector(`#update-task-${task.id}`)
                .addEventListener("click", () => updateTask(task.id));
            document.querySelector(`#delete-task-${task.id}`)
                .addEventListener("click", () => deleteTask(task.id));
            document.getElementById("input-button-" +task.id).value = task.title;
  
};

export {newTask};


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
