/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
var csrf = require("csurf");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser("shh! some secret string"));

app.use(csrf({ cookie: true }));

const { Todo } = require("./models");

// app.get("/", function (request, response) {
//   response.send("Hello World");
// });
app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  const todaytodos = await Todo.getToday();
  //const duelatertodos = await Todo.getdueLater();
  const overduetodos = await Todo.getOverdue();
  const duelatertodos = await Todo.getdueLater();
  const CompletedTodos = await Todo.getcompleted();

  // const todaytodos= await Todo.getToday();getdueLater

  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
      todaytodos,
      overduetodos,
      duelatertodos,
      CompletedTodos,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos,
      todaytodos,
      overduetodos,
      duelatertodos,
      CompletedTodos,
      csrfToken: request.csrfToken(),
    });
  }
});

app.get("/todos", async function (request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const todos = await Todo.findAll();
    return response.send(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  //Todo
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(todo.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
  }
  // const affectedRow = await Todo.destroy({ where: { id: request.params.id } });
  // response.send(affectedRow ? true : false);
});

module.exports = app;
