// importing axios 
import axios from 'axios';

// importing addNewData from main.js 
import { addNewData } from './main';

// storing base url of todo API
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';


// function to get task of user and display it using addNewData function 
function getTasks() {

    // fetching api using axios 
    // get request to get task of users 
    axios({

        // providing headers 
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function (res) {

        // storing data in array 
        const array = res.data;

        // mapping into array and calling addNewData function
        array.map((data) => {
            addNewData(data);
        })

    }).catch((e) => {
        console.log(e);
    })
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





