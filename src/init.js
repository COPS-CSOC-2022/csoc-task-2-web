import axios from 'axios';
// import { updateTask, deleteTask, editTask } from './main';

function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    // get data from server using axios and API_BASE_URL with the token in localStorage
    axios({
        url: API_BASE_URL + 'todo/',
        method: 'get',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
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
            tasks_container.id = 'task-' + d.id;
            const task_name = document.createElement('div');
            task_name.classList.add('todo-task');
            task_name.innerHTML = d.title;
            const span = document.createElement('span');
            const btn_1 = document.createElement('button');
            btn_1.classList.add('btn');
            btn_1.classList.add('btn-outline-warning');
            btn_1.style.marginRight = '10px';
            const btn_2 = document.createElement('button');
            btn_2.classList.add('btn');
            btn_2.classList.add('btn-outline-danger');


            btn_2.addEventListener('click', function () {

                displayInfoToast('Please wait...');


                axios({
                    url: API_BASE_URL + 'todo/' + d.id + '/',
                    method: 'delete',
                    headers: {
                        Authorization: 'Token ' + localStorage.getItem('token')
                    }
                }).then(function ({ dat, stat }) {

                    displaySuccessToast('Task deleted successfully');
                    console.log(dat);
                    // remove the task from the dom
                    const task_to_delete = document.getElementById('task-' + d.id);
                    task_to_delete.remove();
                }).catch(function (error) {
                    // display error toast
                    displayErrorToast('Error deleting task');
                    console.log(error);
                }
                );
            }
            );


            span.append(btn_1, btn_2);
            tasks_container.append(task_name, span);
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
}).then(function ({ data, status }) {
    document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
    document.getElementById('profile-name').innerHTML = data.name;
    getTasks();
})

// export both function from page to be used in other files
export { getTasks };

