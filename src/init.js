import axios from 'axios';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    console.log('getTasks');
    //get token from local storage for authentication
    const token = localStorage.getItem('token');
    axios({
        url: API_BASE_URL + 'todo/',
        method: 'get',
        headers: {
            'Authorization': 'Token ' + token
        },
    }).then(function ({ data, status }) {
        console.log(data);
        const list_group = document.querySelector('.list-group');
        list_group.textContent = '';
        data.forEach(d => {
            const tasks_container = document.createElement('li');
            tasks_container.classList.add('list-group-item');
            tasks_container.classList.add('d-flex');
            tasks_container.classList.add('justify-content-between');
            tasks_container.classList.add('align-items-center');
            tasks_container.id = d.id;
            // add a input field to edit the task
            const input_field = document.createElement('input');
            input_field.classList.add('form-control');
            input_field.classList.add('todo-edit-task-input');
            input_field.classList.add('hideme');
            input_field.id = 'input-button-' + d.id;
            input_field.placeholder = 'Edit The Task';
            input_field.type = 'text';
            // create a div to store button
            const button_container = document.createElement('div');
            button_container.classList.add('input-group-append');
            button_container.classList.add('hideme');
            button_container.id = 'done-button-' + d.id;
            // create a div and done button inside it to save edited task
            const done_button = document.createElement('button');
            done_button.classList.add('btn');
            done_button.classList.add('btn-success');
            done_button.classList.add('todo-update-task');
            done_button.type = 'button';
            done_button.setAttribute('onclick', 'updateTask(' + d.id + ')');
            done_button.innerHTML = 'Done';
            button_container.append(done_button);
            const task_name = document.createElement('div');
            task_name.classList.add('todo-task');
            task_name.innerHTML = d.title;
            task_name.id = 'task-' + d.id;
            const span = document.createElement('span');
            const btn_1 = document.createElement('button');
            btn_1.classList.add('btn');
            btn_1.classList.add('btn-outline-warning');
            btn_1.style.marginRight = '10px';
            btn_1.addEventListener('click', () => {
                editTask(d.id);
            }
            );
            const btn_2 = document.createElement('button');
            btn_2.classList.add('btn');
            btn_2.classList.add('btn-outline-danger');
            btn_2.addEventListener('click', () => { deleteTask(d.id) });
            span.append(btn_1, btn_2);
            span.id = 'task-actions-' + d.id;
            tasks_container.append(input_field, button_container, task_name, span);
            list_group.append(tasks_container);
            const img_1 = document.createElement('img');
            img_1.src = 'https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png';
            img_1.width = '18';
            img_1.height = '20';
            btn_1.appendChild(img_1);
            const img_2 = document.createElement('img');
            img_2.src = 'https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg';
            img_2.width = '18';
            img_2.height = '22';
            btn_2.appendChild(img_2);
        });
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
})


function getSearchedTasks(data) {
    console.log(data);
    const list_group = document.querySelector('.list-group');
    list_group.textContent = '';
    data.forEach(d => {
        const tasks_container = document.createElement('li');
        tasks_container.classList.add('list-group-item');
        tasks_container.classList.add('d-flex');
        tasks_container.classList.add('justify-content-between');
        tasks_container.classList.add('align-items-center');
        tasks_container.id = d.id;
        const input_field = document.createElement('input');
        input_field.classList.add('form-control');
        input_field.classList.add('todo-edit-task-input');
        input_field.classList.add('hideme');
        input_field.id = 'input-button-' + d.id;
        input_field.placeholder = 'Edit The Task';
        input_field.type = 'text';
        const button_container = document.createElement('div');
        button_container.classList.add('input-group-append');
        button_container.classList.add('hideme');
        button_container.id = 'done-button-' + d.id;
        const done_button = document.createElement('button');
        done_button.classList.add('btn');
        done_button.classList.add('btn-outline-secondary');
        done_button.classList.add('todo-update-task');
        done_button.type = 'button';
        done_button.setAttribute('onclick', 'updateTask(' + d.id + ')');
        done_button.innerHTML = 'Done';
        button_container.append(done_button);
        const task_name = document.createElement('div');
        task_name.classList.add('todo-task');
        task_name.innerHTML = d.title;
        task_name.id = 'task-' + d.id;
        const span = document.createElement('span');
        const btn_1 = document.createElement('button');
        btn_1.classList.add('btn');
        btn_1.classList.add('btn-outline-warning');
        btn_1.style.marginRight = '10px';
        btn_1.addEventListener('click', () => {
            editTask(d.id);
        }
        );
        const btn_2 = document.createElement('button');
        btn_2.classList.add('btn');
        btn_2.classList.add('btn-outline-danger');
        btn_2.addEventListener('click', () => { deleteTask(d.id) });
        span.append(btn_1, btn_2);
        span.id = 'task-actions-' + d.id;
        tasks_container.append(input_field, button_container, task_name, span);
        list_group.append(tasks_container);
        const img_1 = document.createElement('img');
        img_1.src = 'https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png';
        img_1.width = '18';
        img_1.height = '20';
        btn_1.appendChild(img_1);
        const img_2 = document.createElement('img');
        img_2.src = 'https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg';
        img_2.width = '18';
        img_2.height = '22';
        btn_2.appendChild(img_2);
    });
}



axios({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'get',
}).then(function ({ data }) {
    document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
    document.getElementById('profile-name').innerHTML = data.name;
    getTasks();
})
//export getTasks() for use in main.js
export { getTasks };
export { getSearchedTasks};
