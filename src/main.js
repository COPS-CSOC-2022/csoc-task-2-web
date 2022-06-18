import axios from 'axios';
const regs = document.getElementById("regs");
console.log(regs);
const logte =document.getElementById("logte");
console.log(logte);
const logi =document.getElementById("logi");
console.log(logi);
const showTaskData = document.getElementById("showTaskData");

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

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login/';
    displaySuccessToast("Successfully Logged Out")
}
if(logte){
    logte.addEventListener('click',()=>{
        logout();
    })
}
function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
}
console.log("hekki");
export function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    console.log(username);
    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");
        
        const  dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }
        
        axios({
            url: API_BASE_URL + 'auth/register/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
            console.log(data.token);
            localStorage.setItem('token', data.token);
            displaySuccessToast(`Account created successfully with username ${username}`)
            window.location.href = '/';
        }).catch(function(err) {
            displayErrorToast('An account using same email or username is already created');
            console.log(err);
        })
    }
}
if(regs){
    regs.addEventListener('click',()=>{
        register();
    })
}
export function login() {
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    if (username !="" && password!="") {
        displayInfoToast("Please wait...");
        
         const dataForApiRequest = {
            username: username,
            password: password
        }
        
        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
            console.log(data.token);
            localStorage.setItem('token', data.token);
            displaySuccessToast(`Logged in successfully as ${username}`)
            window.location.href = '/';
        }).catch(function(err) {
            displayErrorToast("Account with this username or password does not exist");
            console.log(err);
        })
    }
}
if(logi){
    logi.addEventListener('click',()=>{
        login();
    })
}
export function addTask() {
    const taskData =document.getElementById("taskData");
    const inData = {
        title:taskData.value,
    }
   axios({
        url:API_BASE_URL + 'todo/create/',
        method:'post',
        headers:{
            Authorization:'Token '+localStorage.getItem('token')
        },
        data:inData,
    }).then((data)=>{
        console.log(data);
        getTasks()
        displaySuccessToast("New task created successfully")
        taskData.value =null;
    }).catch((err)=>{
        console.log(err);
        displayErrorToast(err)
    })
}

export function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
   document.querySelector('#input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}
export function deleteTask(id) {
    axios({
        method:'delete',
        url:API_BASE_URL+`todo/${id}/`,
        headers:{
            Authorization:'Token '+localStorage.getItem('token')
            
        }
    }).then((res)=>{
        console.log(res);
        getTasks()
       displaySuccessToast("SuccessFully Deleted the tasks")
    }).catch((e)=>{
        console.log(e);
        displayErrorToast(e)
    })
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from  */
}
export function updateTask(id) {
   const updateBtn = document.querySelector('#input-button-' + id);
        axios({
            method:'patch',
            url:API_BASE_URL+`todo/${id}/`,
            data:{
                title:updateBtn.value
            },
            headers:{
                Authorization:'Token '+localStorage.getItem('token')
            }
        }).then((data)=>{
            console.log(data);
            displaySuccessToast("Task updated successfully")
            getTasks();
        }).catch((e)=>{
            console.log(e);
            displayErrorToast(e)
        })
        document.getElementById('task-' + id).classList.remove('hideme');
        document.getElementById('task-actions-' + id).classList.remove('hideme');
        updateBtn.classList.add('hideme');
        document.getElementById('done-button-' + id).classList.add('hideme');
       

    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}
var arr=new Array();
function search() {
    const searchData = document.getElementById("searchData");
    console.log(searchData.value);
    let flag =false;
    const p = document.getElementsByClassName("todo-task");
    // arr.length=0;
    console.log(arr);
    Array.from(p).forEach((e)=>{
        let x= searchData.value;
        let l=x.length;
        console.log(l);
        let c = e.innerText.slice(0,l);
        if(c===x){
            flag=true;
           arr.push(e);
        }
    })
    console.log(flag);
    // console.log(arr);
        // const mainData=document.getElementById('mainData');
        const showSearchData = document.getElementById('showSearchData')
        const showSearchTaskData = document.getElementById('showSearchTaskData')
        if(flag){
            // mainData.classList.add("hideme");
            showSearchData.classList.remove("hideme")
            showSearchTaskData.innerHTML =""
            arr.map((e)=>{
                // let x =""
                let l=e.id.length;
                let x=e.id.substring(5,l)
                showSearchTaskData.innerHTML+=`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                <input id="input-button-${x}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                <div id="done-button-${x}" class="input-group-append hideme">
                    <button class="btn btn-outline-secondary todo-update-task" id="updateTask-${x}" type="button" onclick="updateTask(${x})">Done</button>
                </div>
                
                <div id="task-${x}" class="todo-task" value=${x}>
                   ${e.innerText}
                </div>
                <span id="task-actions-${x}">
                    <button style="margin-right:5px;" type="button"  
                    class="btn btn-outline-warning" onclick="editTask(${x})">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
                </button>
                <button type="button" id="deleteBtn-${x}" onclick="deleteTask(${x})" class="btn btn-outline-danger">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
                </button>
            </span>
            </li>
                `
            })
            searchData.value=''
        }
        else {
            displayInfoToast("No such Task Exists")
            searchData.value=""
        }
        const backBtn = document.getElementById("backBtn")
        if(backBtn){
            backBtn.addEventListener("click",()=>{
                // mainData.classList.remove("hideme")
                showSearchData.classList.add("hideme");
                searchData.value=""
            })
        }
        arr=[]
        console.log(arr);
    }
window.search=search;
window.addTask =addTask;
window.deleteTask=deleteTask;
window.editTask=editTask;
window.updateTask=updateTask;
