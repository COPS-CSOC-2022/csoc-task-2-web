const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";

function displayErrorToast(message) {
  iziToast.error({
    title: "Error",
    message: message,
  });
}

function getTasks() {
  axios({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + "todo/",
  })
    .then(function ({ data, status }) {
      const list = document.getElementById("availableTasks");
      data.forEach((element) => {
        list.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center" id="taskItem-${element.id}">
      <input id="input-button-${element.id}" type="text" class="form-control todo-edit-task-input hideme"
          placeholder="Edit The Task">
      <div id="done-button-${element.id}" class="input-group-append hideme">
          <button class="btn btn-outline-secondary todo-update-task" type="button"
              onclick="updateTask(${element.id})">Done</button>
      </div>
      <div id="task-${element.id}" class="todo-task">
          ${element.title}
      </div>

      <span id="task-actions-${element.id}">
          <button style="margin-right:5px;" type="button" onclick="editTask(${element.id})"
              class="btn btn-outline-warning">
              <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                  width="18px" height="20px">
          </button>
          <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${element.id})">
              <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                  width="18px" height="22px">
          </button>
      </span>
  </li>`;
      });
    })
    .catch(function (err) {
      displayErrorToast("Oops! Something went wrong!");
    });
}
window.getTasks = getTasks;

axios({
  headers: {
    Authorization: "Token " + localStorage.getItem("token"),
  },
  url: API_BASE_URL + "auth/profile/",
  method: "get",
}).then(function ({ data, status }) {
  document.getElementById("avatar-image").src =
    "https://ui-avatars.com/api/?name=" +
    data.name +
    "&background=fff&size=33&color=007bff";
  document.getElementById("profile-name").innerHTML = data.name;
  getTasks();
});
