import axios from 'axios';
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
        // display the tasks in the dom
        const list_group = document.querySelector('.list-group');
        // loop though the tasks and display them in the dom
        data.forEach(d => {
            const tasks_container = document.createElement('li');
            // tasks_container.classList.add('d-flex justify-content-between align-items-center');
            const task_name = document.createElement('div');
            task_name.classList.add('todo-task');
            task_name.innerHTML = d.title;
            const span = document.createElement('span');
            const btn_1 = document.createElement('button');
            // btn_1.classList.add('btn btn-outline-warning');
            const btn_2 = document.createElement('button');
            // btn_2.classList.add('btn btn-outline-danger');
            span.append(btn_1, btn_2);
            tasks_container.append(task_name, span);
            list_group.append(tasks_container);
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

