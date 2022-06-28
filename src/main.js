import axios from "axios";
import { getTasks } from "./init";

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const registerBtn = document.getElementById("register-btn");
const addtaskBtn = document.getElementById("add-task");

window.editTask = editTask;
window.updateTask = updateTask;
window.deleteTask = deleteTask;

window.onload = () => {
  if (loginBtn) loginBtn.onclick = login;
  if (logoutBtn) logoutBtn.onclick = logout;
  if (registerBtn) registerBtn.onclick = register;
  if (addtaskBtn) addtaskBtn.onclick = addTask;
};

function displaySuccessToast(message) {
  iziToast.success({
    title: "Success",
    message: message,
    timeout: 3000,
  });
}

function displayErrorToast(message) {
  iziToast.error({
    title: "Error",
    message: message,
    timeout: 3000,
  });
}

function displayInfoToast(message) {
  iziToast.info({
    title: "Info",
    message: message,
    timeout: 3000,
  });
}

const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login/";
}

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

function loginFieldsAreValid(username, password) {
  if (username === "" || password === "") {
    displayErrorToast("Username or Password cannot be EMPTY");
    return false;
  }
  return true;
}

function login() {
  const username = document.getElementById("inputUsername").value.trim();
  const password = document.getElementById("inputPassword").value;

  if (loginFieldsAreValid(username, password)) {
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
        displayErrorToast("Invalid username or password");
      });
  }
}

function addTask() {
  const newTask = document.getElementById("new-task").value.trim();

  if (newTask == "") {
    displayErrorToast("Task name cannot be epmty .");
    return;
  }

  const dataForApiRequest = {
    title: newTask,
  };

  axios({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + "todo/create/",
    method: "post",
    data: dataForApiRequest,
  })
    .then(function ({ data, status }) {
      displaySuccessToast("Task added successfully");
      getTasks();
      document.getElementById("new-task").value = "";
    })
    .catch(function (err) {
      displayErrorToast("Oops ! Something went wrong .");
    });
}

function editTask(id) {
  document.getElementById("task-" + id).classList.add("hideme");
  document.getElementById("task-actions-" + id).classList.add("hideme");
  document.getElementById("input-button-" + id).classList.remove("hideme");
  document.getElementById("done-button-" + id).classList.remove("hideme");
}

function deleteTask(id) {
  axios({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + "todo/" + id + "/",
    method: "delete",
  })
    .then(function ({ data, status }) {
      displaySuccessToast("Task deleted successfully");
      getTasks();
    })
    .catch(function (err) {
      displayErrorToast("Oops! Something went wrong");
    });
}

function updateTask(id) {
  const new_task_name = document
    .getElementById("input-button-" + id)
    .value.trim();

  if (new_task_name == "") {
    displayErrorToast("Task name cannot be empty");
    return;
  }
  const dataForApiRequest = {
    title: new_task_name,
  };

  axios({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + "todo/" + id + "/",
    method: "put",
    data: dataForApiRequest,
  })
    .then(function ({ data, status }) {
      displaySuccessToast("Task updated successfully");
      getTasks();
    })
    .catch(function (err) {
      displayErrorToast("Oops! Something went wrong");
    });
}
