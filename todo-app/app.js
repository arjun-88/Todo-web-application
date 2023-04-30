/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const { Todo } = require("./models");

app.use(bodyParser.json());

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

  // const todaytodos= await Todo.getToday();getdueLater

  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
      todaytodos,
      overduetodos,
      duelatertodos,
    });
  } else {
    response.json({
      allTodos,
      todaytodos,
      overduetodos,
      duelatertodos,
    });
  }

  response.render("index");
});

app.use(express.static(path.join(__dirname, "public")));

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
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  const affectedRow = await Todo.destroy({ where: { id: request.params.id } });
  response.send(affectedRow ? true : false);
});

module.exports = app;
