import axios from 'axios';
import { getTasks } from './init';

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
}
window.logout=logout
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

function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
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
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) { console.log(err);
          displayErrorToast('An account using same email or username is already created');
        })
    }
}
window.register = register;
function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend, login and direct user to home page.
     */
     const username = document.getElementById('inputUsername').value.trim();
     const password = document.getElementById('inputPassword').value;
     if(username== ''|| password==''){displayErrorToast("Please fill all the fields correctly.");
     return false;}

     const dataForApiRequest = {
        username: username,
        password: password
    }

    axios({
        url: API_BASE_URL + 'auth/login/',
        method: 'post',
        data: dataForApiRequest,
    }).then(function({data, status}) {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    }).catch(function(err) { console.log(err);
      displayErrorToast('Invalid credentials');
    })

}
window.login=login
function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const title = document.getElementById("addtask").value;
    const dataForApiRequest = {
        
        title: title
    }
    
            axios({
            headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
             url: API_BASE_URL + 'todo/create/',
             method: 'post',
             data: dataForApiRequest,
         }).then(function({status}) {
           displayInfoToast("Added Task!")

 
getTasks();
           
         }).catch(function(err) { console.log(err);
           displayErrorToast('Something went wrong!');
         })
     }    
window.addTask=addTask;


function editTask(id) {
    document.getElementById("task-" + id).classList.add("hideme");
    document.getElementById("task-actions-" + id).classList.add("hideme");
    document.getElementById("input-button-" + id).classList.remove("hideme");
    document.getElementById("done-button-" + id).classList.remove("hideme");
    
}
window.editTask=editTask;
function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
     axios({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + 'todo/'+ id +'/',
         method: 'DELETE',
    
       })
       .then(function (data, status) {
        console.log(data)
        displayInfoToast("Item deleted successfully");
        getTasks();
      })
      .catch(function (err) {console.log(id);
        displayErrorToast("Your Request couldn't be completed");
      

       })
}
window.deleteTask=deleteTask



function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */

     const updateTitle = document.getElementById("input-button-" + id).value;
     const dataForApiRequest = {
       id: id,
       title: updateTitle,
     };
     console.log(dataForApiRequest);
     axios({
       headers: {
         Authorization: "Token " + localStorage.getItem("token"),
       },
       url: API_BASE_URL + "todo/" + id + "/",
       method: "patch",
       data: dataForApiRequest,
     })
       .then(function ({ data, status }) {
         document.getElementById("task-" + id).classList.remove("hideme");
         document.getElementById("task-actions-" + id).classList.remove("hideme");
         document.getElementById("input-button-" + id).classList.add("hideme");
         document.getElementById("done-button-" + id).classList.add("hideme");
         const update = document.getElementById("task-" + id);
         update.textContent = updateTitle;
       })
       .catch(function (err) {
         displayErrorToast("Some Unknown Error Occurred!");
       });
   }
 
   window.updateTask = updateTask; 


function search(){
  axios({
    headers: {
        Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + 'todo/',
     method: 'get',

   })
   .then(function ({status,data}){
    
    const list= document.getElementById("alltodos")
    list.innerHTML='';
    const word = document.getElementById("searchtask").value.toLowerCase();
    for(let i=0;i<data.length;i++){let recent_element=data[i];
    console.log((data[i].title))
    if(data[i].title.toLowerCase().search(word)!=-1){
      
      
      list.innerHTML+= 
    
      `<li class="list-group-item d-flex justify-content-between align-items-center">
                      <input id="input-button-${recent_element.id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                      <div id="done-button-${recent_element.id}"  class="input-group-append hideme">
                          <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(${recent_element.id})">Done</button>
                      </div>
                      <div id="task-${recent_element.id}" class="todo-task">
                      ${recent_element.title}
                      </div>
  
                      <span id="task-actions-${recent_element.id}">
                          <button style="margin-right:5px;" type="button" onclick="editTask(${recent_element.id})"
                              class="btn btn-outline-warning">
                              <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                                  width="18px" height="20px">
                          </button>
                          <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${recent_element.id})">
                              <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                                  width="18px" height="22px">
                          </button>
                      </span>
              </li> `
  
    }
    }
   })
.catch(function(err) { console.log(err);
   displayErrorToast('Something went wrong!');
 })


}
window.search=search