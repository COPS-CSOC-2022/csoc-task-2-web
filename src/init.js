import axios from 'axios';
import mainJsImports from "./main.js";

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function createTaskLi(data) {
    console.log("createTaskLi is running");

    // clearing the previous form
    document.querySelector("#final-list").innerHTML = "";

    data.data.forEach((element, index) => {

        document.querySelector("#final-list").innerHTML += 
        `<li class="list-group-item d-flex justify-content-between align-items-center">
            <input id="input-button-${index}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${index}"  class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button">Done</button>
            </div>
            <div id="task-${index}" class="todo-task">
                ${element.title}
            </div>

            <span id="task-actions-${index}">
                <button style="margin-right:5px;" type="button"
                    class="btn btn-outline-warning" id="" >
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                        width="18px" height="20px">
                </button>
                <button type="button" class="btn btn-outline-danger btn-task-del" data-id="${element.id}" id="btn-task-del-${index}">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>
        </li>`;
    });

}

function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */

    console.log("getTasks hasn't yee'd his last haw yet");

    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + "todo/",
        method: 'get',
    }).then((data, status) => {
        console.log(data);
        
        createTaskLi(data);

        mainJsImports.setDeleteListeners();
    });
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
});

const exports = { getTasks: getTasks };

export default exports;
