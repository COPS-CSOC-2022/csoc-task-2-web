# Todo Application - CSoC Dev Web Task 2

## Introduction

In this task you will be working on a todo application made using basic HTML, CSS and JS. The main motive of this task is to make you familiar with:

- Rest APIs
- AJAX
- Manipulating DOM using JavaScript

## Setting up the project

Follow the following steps to setup this project.

_Note_ - Make sure you have node and npm installed in your system. If not, follow the steps given [here](https://nodejs.org/en/download/) to install it.

### Fork this repository

First of all, click on the top-right corner of this repository to fork it.

### Create a local clone of your fork

Then, clone your forked repository using this command:

```
git clone https://github.com/YOUR-USERNAME/csoc-task-2-web.git
```

Change your current directory to the repo's root.

```
cd csoc-task-2-web
```

### Run the server

Install the dependencies using

```
npm i
```

Then you can finally run the server using this command.

```
npm run dev
```

Then you can go to `localhost:3000` in your browser.

### Deploying App

You can use netlify or vercel for deploying your app. The build command is

```
npm run build
```

This will create a `dist` folder which can be served now

## Todo Application

There are three pages in this site.

- `/` - This is the main page where the user can create, edit or delete the tasks.
- `/login/` - This is the login page.
- `/register/` - This is the register page.

We have also created a backend server containing the API endpoints required for this application to function completely - [https://todo-app-csoc.herokuapp.com/](https://todo-app-csoc.herokuapp.com/)

**The complete description of the API is mentioned at the end of this readme.**

## Tasks

You would notice that the application is not functional completely. So, your task is to make it completely functional. You would be working in `main.js`, `init.js`, `auth_required.js` and `no_auth_required.js` mainly. There are several todos mentioned in these files. You have to complete those. The html files might need modification too.

In particular you have to:

- **Make all the buttons functional** - You may notice that the buttons do not work yet. You have to make edits so that the corresponding functions in `main.js` are triggered when the buttons are clicked..

- **Complete the auth_required.js and no_auth_required.js** - You may notice that initially you are landed on the main page even when you are not logged in. That is wrong. In this files you have to write code to redirect user to pages based on whether he/she is authenticated or not.

- **Login Function** - Currently only register function works. You have to complete the login function too.

- **Get Tasks function** - There is a function `getTasks` in `init.js`. You would notice that even after logging in, you see two tasks _Sample Task 1_ and _Sample Task 2_. These tasks were not created by you. These are dummy tasks. You have complete the `getTasks` function such that the tasks listed are the ones created by the user. (You might have to complete the `addTask` function first)

- **Add, Update, Delete Task function** - These functions are present in the `main.js` file. You have to complete them.

- **Deploy and implement search feature (BONUS)** - You should deploy the website and implement a search task feature to search
  tasks in the ToDo list (Open to creativity).

## Points

Here is the breakdown of the points related to each task.

| **Task**                                     | **Points** |
| -------------------------------------------- | ---------- |
| Login Function                               | 15         |
| `auth_required.js` and `no_auth_required.js` | 15         |
| Add task                                     | 25         |
| Get tasks                                    | 25         |
| Edit Task                                    | 35         |
| Delete Task                                  | 35         |
| Bonus Task                                   | 30         |
| **Total**                                    | 180        |

## Heads-Up & Tips

- iziToast is a simple and fast plugin used to create responsive, elegant and CSS3 animated toast notifications of various types in the screen.

- When confused on how to implement a function, try to find other completed functions that fulfill similar objectives.
  Learning from others' code and applying that knowledge for your needs, is critical for a developer.

- Instead of just jumping onto the tasks, try to fiddle around and understand the flow of the code. Then, for any task,
  try to break it into further easier subtasks.

- No subtask is too difficult for you. If you get stuck, try to struggle your way through by seeking assistance from any internet resource.
  APIs are key to development, and this struggle will definitely boost your confidence and skills.

## Judging

Judging would be done on the basis of your implementation and authenticity.

## Deadline

You'll have a week to complete this task. Hence, the deadline of this task is **16th June, 2022**.

## Submission

- Follow the instructions to setup this project.
- Complete the task by making the required changes in the files.
- This time, you **do not need** to put your files in a separate folder.
- When done, commit your work locally and push it to your origin (forked repository).
- Make a pull request to our repository, stating the tasks which you have completed.
- Let us review your pull request.

## API Usage

### Auth System

All the requests made to the API (except the Login and Register endpoints) need an **Authorization header** with a valid token and the prefix **Token**

`Authorization: Token <token>`

In order to obtain a valid token it's necessary to send a request `POST /auth/login/` with **username** and **password**. To register a new user it's necessary to make a request `POST /auth/register/` with name, email, username and password.

### End Points

**Auth**

- `POST /auth/login/`

  Takes the username and password as input, validates them and returns the **Token**, if the credentials are valid.

  Request Body (Sample):

  ```
  {
    "username": "string",
    "password": "string"
  }
  ```

  Response Body (Sample):

  ```
  {
    "token":  "string"
  }
  ```

  Response Code: `200`

- `POST /auth/register/`

  Register a user in Django by taking the name, email, username and password as input.

  Request Body (Sample):

  ```
  {
    "name": "string",
    "email": "user@example.com",
    "username": "string",
    "password": "string"
  }
  ```

  Response Body (Sample):

  ```
  {
    "token":  "string"
  }
  ```

  Response Code: `200`

- `POST /auth/profile/`

  Retrieve the id, name, email and username of the logged in user. Requires token in the Authorization header.

  Response Body (Sample):

  ```
  {
    "id":  1,
    "name":  "string",
    "email":  "user@example.com",
    "username":  "string"
  }
  ```

  Response Code: `200`

**Todo**

- `GET /todo/`

  Get all the Todos of the logged in user. Requires token in the Authorization header.

  Response Body (Sample):

  ```
  [
    {
      "id":  1,
      "title":  "string"
    },
    {
      "id":  2,
      "title":  "string"
    }
  ]
  ```

  Response Code: `200`

- `POST /todo/create/`

  Create a Todo entry for the logged in user. Requires token in the Authorization header.

  Request Body (Sample):

  ```
  {
    "title": "string"
  }
  ```

  Response Code: `200`

- `GET /todo/{id}/`

  Get the Todo of the logged in user with given id. Requires token in the Authorization header.

  Response Body (Sample):

  ```
  {
    "id":  1,
    "title":  "string"
  }
  ```

  Response Code: `200`

- `PUT /todo/{id}/`

  Change the title of the Todo with given id, and get the new title as response. Requires token in the Authorization header.

  Request Body (Sample):

  ```
  {
    "title": "string"
  }
  ```

  Response Body (Sample):

  ```
  {
    "id":  1,
    "title":  "string"
  }
  ```

- `PATCH /todo/{id}/`

  Change the title of the Todo with given id, and get the new title as response. Requires token in the Authorization header.

  Request Body (Sample):

  ```
  {
    "title": "string"
  }
  ```

  Response Body (Sample):

  ```
  {
    "id":  1,
    "title":  "string"
  }
  ```

- `DELETE /todo/{id}/`

  Delete the Todo with given id. Requires token in the Authorization header.

  Response Code: `204`

All the requests must be prefixed with the base URL of the API.
Example: for login the `POST` request must be sent to `https://todo-app-csoc.herokuapp.com/auth/login/` with the required details. **Make sure to append a slash at the end, otherwise you may encounter an error while making the `POST` request.**

### Documentation

Swagger generated docs: [https://todo-app-csoc.herokuapp.com/](https://todo-app-csoc.herokuapp.com/)
ReDoc generated docs: [https://todo-app-csoc.herokuapp.com/redoc/](https://todo-app-csoc.herokuapp.com/redoc/)

### Testing the API

The API can be tested by going to the deployed URL: [https://todo-app-csoc.herokuapp.com/](https://todo-app-csoc.herokuapp.com/), clicking the "Try it out" button after selecting the endpoint and finally executing it along with the Response Body (if required).

For testing the endpoints which require **Token** in the Authorization header, you can click on the "Authorize" button, write the Authorization token as `Token <token>` (which you have obtained from the `auth/login/` endpoint) and finally click on "Authorize". Thereafter, all the requests made to any endpoint will have the Token in the Authorization Header.

### All the best!
