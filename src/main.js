function displaySuccessToast(message) {
    iziToast.success({
      title: "Success",
      message: message,
    });
  }
  
  function displayErrorToast(message) {
    iziToast.error({
      title: "Error",
      message: message,
    });
  }
  
  function displayInfoToast(message) {
    iziToast.info({
      title: "Info",
      message: message,
    });
  }
  
  const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";
  
  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login/";
  }
  
  window.logout = logout;
  
  function registerFieldsAreValid(
    firstName,
    lastName,
    email,
    username,
    password
  ) {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      username === "" ||
      password === ""
    ) {
      displayErrorToast("Please fill all the fields correctly.");
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      displayErrorToast("Please enter a valid email address.");
      return false;
    }
    return true;
  }
  
  function register() {
    const firstName = document.getElementById("inputFirstName").value.trim();
    const lastName = document.getElementById("inputLastName").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;
  
    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
      displayInfoToast("Please wait...");
  
      const dataForApiRequest = {
        name: firstName + " " + lastName,
        email: email,
        username: username,
        password: password,
      };
  
      axios({
        url: API_BASE_URL + "auth/register/",
        method: "post",
        data: dataForApiRequest,
      })
        .then(function ({ data, status }) {
          localStorage.setItem("token", data.token);
          window.location.href = "/";
        })
        .catch(function (err) {
          displayErrorToast(
            "An account using same email or username is already created"
          );
        });
    }
  }
  
  window.register = register;
  
  function login() {
    const username = document.getElementById("inputUsername").value.trim();
    const password = document.getElementById("inputPassword").value;
  
    displayInfoToast("Please wait...");
  
    const dataForApiRequest = {
      username: username,
      password: password,
    };
    axios({
      url: API_BASE_URL + "auth/login/",
      method: "post",
      data: dataForApiRequest,
    })
      .then(function ({ data, status }) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      })
      .catch(function (err) {
        displayErrorToast("Invalid Credentials");
      });
  }
  
  window.login = login;
  
  function addTask() {
    const title = document.getElementById("addTask").value.trim();
    console.log(title);
    const dataForApiRequest = {
      title: title,
    };
    axios({
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      url: API_BASE_URL + "todo/create/",
      method: "post",
      data: dataForApiRequest,
    })
      .then(function ({ status }) {
        displaySuccessToast("Todo added Successfully!");
        // Get Tasks and render it into the DOM
        axios({
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
          url: API_BASE_URL + "todo/",
        })
          .then(function ({ data, status }) {
            const lastElement = data[data.length - 1];
            const list = document.getElementById("availableTasks");
            list.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center" id="taskItem-${lastElement.id}>
              <input id="input-button-${lastElement.id}" type="text" class="form-control todo-edit-task-input hideme"
            placeholder="Edit The Task">
        <div id="done-button-${lastElement.id}" class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button"
                onclick="updateTask(${lastElement.id})">Done</button>
        </div>
        <div id="task-${lastElement.id}" class="todo-task">
            ${lastElement.title}
        </div>
  
        <span id="task-actions-${lastElement.id}">
            <button style="margin-right:5px;" type="button" onclick="editTask(${lastElement.id})"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${lastElement.id})" id="delButton">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>
    </li>`;
          })
          .catch(function (err) {
            console.error(err);
            displayErrorToast("Oops! Something went wrong!");
          });
      })
      .catch(function (err) {
        displayErrorToast("Enter a Valid Task Title");
      });
  }
  
  window.addTask = addTask;
  
  function editTask(id) {
    document.getElementById("task-" + id).classList.add("hideme");
    document.getElementById("task-actions-" + id).classList.add("hideme");
    document.getElementById("input-button-" + id).classList.remove("hideme");
    document.getElementById("done-button-" + id).classList.remove("hideme");
  }
  
  window.editTask = editTask;
  
  function deleteTask(id) {
    axios({
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      url: API_BASE_URL + "todo/" + id + "/",
      method: "delete",
    })
      .then(function (status) {
        const listItem = document.getElementById("taskItem-" + id);
        listItem.parentElement.removeChild(listItem);
        displayInfoToast("Item has been deleted successfully");
      })
      .catch(function (err) {
        displayErrorToast("Your Request couldn't be completed");
      });
  }
  window.deleteTask = deleteTask;
  
  function updateTask(id) {
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
