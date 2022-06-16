
// taking buttons and storing them
const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");
const logOutButton = document.getElementById("logout-button");
const addTaskButton = document.getElementById("add-task-button");
const searchButton = document.getElementById("search-button");


// if buttons present adding event listener to them on click
window.onload = () => {
    if (registerButton) {
        registerButton.addEventListener("click", register);
    }
    if (logOutButton) {
        logOutButton.addEventListener("click", logout);
    }
    if (loginButton) {
        loginButton.addEventListener("click", login);
    }
    if (addTaskButton) {
        addTaskButton.addEventListener("click", addTask);
    }
    if (searchButton) {
        searchButton.addEventListener("click", searchTask);
    }
}


// customized success toast 
function displaySuccessToast(message) {
    iziToast.success({
        backgroundColor: 'green',
        transitionIn:'bounceInDown',
        messageColor:'white',
        titleColor:'white',
        title: 'Success',
        message: message
    });
}

// customized error toast
function displayErrorToast(message) {
    iziToast.error({
        backgroundColor: 'red',
        transitionIn:'bounceInDown',
        messageColor:'white',
        titleColor:'white',
        title: 'Error',
        message: message
    });
}

// customized info toast
function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

// storing base url of todo API
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';


// logout function
function logout() {
    window.localStorage.removeItem('token');    // removing token from local storage 
    window.location.href = '/login/';           // redirecting to login page 
}

// function to validate  register field  

function registerFieldsAreValid(firstName, lastName, email, username, password) {

    // if anyone is empty show error 
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }

    // if email is not validated show error
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }

    // return true 
    return true;
}


//  function  to register a user 
function register() {


    // storing all input values in variables 
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        // making object of user data 
        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        console.log(dataForApiRequest);

        // fetching post user api 
        axios({
            url: API_BASE_URL + 'auth/register/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function ({ data, status }) {
            localStorage.setItem('token', data.token);   // storing token in local storage 
            console.log("success");
            displaySuccessToast("New User Registered");
            window.location.href = '/';                  // redirecting to home page 
        }).catch(function (err) {
            displayErrorToast('An account using same email or username is already created');
        })
    }
}

// function to validate login  field

function loginFieldsAreValid(username, password) {

    // if anyone is empty show error
    if (username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }

    // else return true 
    return true;
}



// function to login user 
function login() {

    /***
    * @todo Complete this function.
    * @todo 1. Write code for form validation.
    * @todo 2. Fetch the auth token from backend and login the user.
    */

    // storing all input values in variables 
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();

    if (loginFieldsAreValid(username, password)) {

        displayInfoToast("Please wait...");

        // making object of userLogin data
        const dataForApiRequest = {
            username: username,
            password: password
        }

        console.log(dataForApiRequest);

        // fetching api for logging user 
        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function ({ data, status }) {
            localStorage.setItem('token', data.token);  // storing token in local storage 
            window.location.href = '/';
        }).catch((e) => {
            displayErrorToast("Incorrect Credentials");
        })
    }
}


// function to add task 

function addTask() {

    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */

    // taking input task to be added 
    const task = document.querySelector("#task-to-add");

    // if task is empty show error
    if (!task.value.trim()) {
        displayErrorToast('Task cannot be Empty');
        return;
    }

    // making object of task to post 
    const dataForApiRequest = {
        title: task.value
    }

    // fetching api to post task
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/create/',
        method: 'post',
        data: dataForApiRequest
    }).then(function (res) {

        // fetching api to get all tasks
        axios({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo',
            method: 'get',
        }).then(function ({ data, status }) {

            // taking recently added task
            const newData = data[data.length - 1];
            // add task in list 
            addNewData(newData);
            displaySuccessToast("Task Added Successfully");  // show success
        }).catch((err) => {
            displayErrorToast(err);
            console.log(err);
        })
    }).catch(function (err) {
        displayErrorToast(err);
        console.log(err);
    })

    // making task value null 
    task.value = "";

}


// function to edit task it takes id as input 
function editTask(id) {

    // adding and removing hideme class to show edit task option
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}


// function to delete task it takes id as input 

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */

    console.log(id);

    // fetching api to delete task of particular id 

    axios({
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'delete',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        }
    }).then(function ({ data, status }) {

        document.querySelector(`#todo-${id}`).remove();   //removing the task from page 
        displaySuccessToast("Task deleted Successfully!");

    }).catch(function (err) {
        displayErrorToast("Some Error Occured Please Refresh Page And Try Again");
    })
}


// function to update task it takes id as input 

function updateTask(id) {

    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */

    // taking updated task input 
    const updated_task = document.getElementById(`input-button-` + id).value;

    // show error if input is invalid
    if (!updated_task.trim()) {
        displayErrorToast('Task cannot be Empty');
        return;
    }

    // making object of new data
    const dataForApiRequest = {
        title: updated_task
    }

    // fetching api to patch new data
    axios({

        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'patch',
        data: dataForApiRequest,
    }).then(function ({ data, status }) {

        // making changes in  webpage
        const newTask = document.getElementById('task-' + id)
        newTask.innerHTML = updated_task

        displaySuccessToast('Task Updated Successfully');
    }).catch(function (err) {
        displayErrorToast('Failed to update Task');
    })


    // adding and removing hideme class to unshow edit task option
    document.getElementById('input-button-' + id).value = ''
    document.getElementById('task-' + id).classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme');
    document.getElementById('input-button-' + id).classList.add('hideme');
    document.getElementById('done-button-' + id).classList.add('hideme');
}


// function to search task
function searchTask() {

    // getting all tasks
    const allTasks = [...document.getElementsByClassName("todo-task")];
    let length = allTasks.length;

    // removing selected(emphasizing) class from all 
    for (let id = 0; id < length; id++) {
        allTasks[id].parentElement.className = "list-group-item d-flex justify-content-between align-items-center color-li" ;
    }

    // getting input of search task 
    const task = document.querySelector("#search-input");

    // searching index of that task
    const index = allTasks.findIndex((item) => item.innerText == task.value)   

    // if no such index found show error
    if(index == -1)
    {
        displayErrorToast("No Such Task Found")
        return ;
    }

    // if found remove color-li class and add selected(emphasizing) class 
    allTasks[index].parentElement.classList.remove("color-li");
    allTasks[index].parentElement.classList.add("selected");


    // after 3sec  add color-li class and remove selected(emphasizing)  class
    setTimeout(() => {
        allTasks[index].parentElement.classList.remove("selected");
        allTasks[index].parentElement.classList.add("color-li");
    }, 3000);

    // getting id of parent element 
    const id = allTasks[index].parentElement.id ;

    // redirecting to that task
    window.location.href = `/#${id}`;
    task.value = "";
}




// function to addNewData 
function addNewData(newData) {

    // taking ul element 
    const tasksContainer = document.querySelector('.todo-available-tasks');

    // creating new li element 
    const newNode = document.createElement('li');

    // setting id and class of li element 
    newNode.id = `todo-${newData.id}`;
    newNode.className = "list-group-item d-flex justify-content-between align-items-center color-li";

    // adding html 
    newNode.innerHTML =
        `
            <input id="input-button-${newData.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${newData.id}"  class="hideme update-button">
                <button class="btn upd-btn-text" type="button" id="update-task-${newData.id}">Done</button>
            </div>
            <div id="task-${newData.id}" class="todo-task ">
                ${newData.title}
            </div>
            
            <span id="task-actions-${newData.id}">
                <button style="margin-right:5px;" type="button" id="edit-task-${newData.id}"
                class="btn btn-warning background">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
                </button>
                
                <button type="button" class="btn btn-danger background" id="delete-task-${newData.id}">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>
    `;

    // adding new li element to ul 
    tasksContainer.appendChild(newNode);


    // taking edit delete update button of li tag 
    const editBut = document.querySelector(`#edit-task-${newData.id}`);
    const deleteBut = document.querySelector(`#delete-task-${newData.id}`);
    const updateBut = document.querySelector(`#update-task-${newData.id}`);

    // adding eventlistener to  edit delete update button of li tag
    editBut.addEventListener("click", () => editTask(newData.id));
    deleteBut.addEventListener("click", () => deleteTask(newData.id));
    updateBut.addEventListener("click", () => updateTask(newData.id));
}



// exporting addNewData function
export { addNewData };
