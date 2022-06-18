import axios from 'axios';
import {editTask, updateTask, deleteTask, TodoDisplayer} from './main';

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    axios({
        headers : {
            Authorization : "Token " + localStorage.getItem("Token")
        },
        url: API_BASE_URL + "todo/",
        method : "get"
    }).then(function (res){
        const {data,status} = res;

        for(let i=0 ; i<data.length ; i++){
            const newTaskid = data[i].id;
            const task_title = data[i].title;
            TodoDisplayer(newTaskid,task_title);
        }

    })
}

axios({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('Token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'get',
}).then(function({data, status}) {
  document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
  document.getElementById('profile-name').innerHTML = data.name;
  getTasks();
})

