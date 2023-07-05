import axios from 'axios';
import addNew from './main';
const API_BASE_URL = 'https://todo-api-s7vj.onrender.com/';

function getTasks() {
    iziToast.info({
        title: "Info",
        message: "Fetching the todos"
    });
    axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token")
        },
        url: API_BASE_URL + "todo/",
        method: "get"
    }).then( (res)=> {
        let { data, status } = res;
        for (var j=0;j<data.length;j++) {
            let task = data[j].title;
            let taskId = data[j].id;
            addNew(task, taskId);

        }
        iziToast.destroy();
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
