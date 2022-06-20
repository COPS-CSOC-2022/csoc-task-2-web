import axios from 'axios';
import { createTask } from "./main";
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() 
{
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    axios({
        url:API_BASE_URL + "todo/",
        method:"get",
        headers:{
            Authorization:"Token "+localStorage.getItem("token")
        }        
      
    })
    .then(function({data})
    {
        const list_group = document.querySelector('.list-group');
        list_group.textContent = '';
        data.forEach((element) => createTask(element));
    })
    .catch(function (err) {
        iziToast.error({
            title: 'Error',
            message: "Cannot get it!"
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

export { getTasks };