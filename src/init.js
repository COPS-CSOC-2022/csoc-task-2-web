import axios from 'axios';
import { addNewField } from './main.js';
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function (res) {
        const { data, status } = res;
        for (let i of data) {
            const taskIndex = i.id;
            const taskData = i.title;
            addNewField(taskData, taskIndex);
        }
    });
}
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
