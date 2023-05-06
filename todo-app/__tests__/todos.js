const request = require("supertest");
var cheerio = require("cheerio");

const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
    // expect(response.header["content-type"]).toBe(
    //   "application/json; charset=utf-8"
    // );
    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBeDefined();
  });

  test("Marks a todo with the given ID as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "applicatioon/json");
    const ParsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodaycount = ParsedGroupedResponse.todaytodos.length;
    const latestTodo = ParsedGroupedResponse.todaytodos[dueTodaycount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const markCompletedResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
      });

    const parsedUpdateResponse = JSON.parse(markCompletedResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);

    const markCompletedResponse1 = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
      });

    const parsedUpdateResponse1 = JSON.parse(markCompletedResponse1.text);
    expect(parsedUpdateResponse1.completed).toBe(false);
  });

  // test("Fetches all todos in the database using /todos endpoint", async () => {
  //   await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   await agent.post("/todos").send({
  //     title: "Buy ps3",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const response = await agent.get("/todos");
  //   const parsedResponse = JSON.parse(response.text);

  //   expect(parsedResponse.length).toBe(4);
  //   expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  // });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.delete("/todos").send({
      title: "complete assignment",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "applicatioon/json");
    const ParsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodaycount = ParsedGroupedResponse.todaytodos.length;
    const latestTodo = ParsedGroupedResponse.todaytodos[dueTodaycount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const DeletedResponse = await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });

    const parsedUpdateResponse = JSON.parse(DeletedResponse.text);
    expect(parsedUpdateResponse.success).toBe(true);
  });
});

// /* eslint-disable no-unused-vars */
// const request = require("supertest");

// const db = require("../models/index");
// const app = require("../app");
// //const { JSON } = require("sequelize");
// //const { DESCRIBE } = require("sequelize/types/query-types");

// let server, agent;

// describe("Todo test Suite", () => {
//   beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//     server = app.listen(3000, () => {});
//     agent = request.agent(server);
//   });
//   afterAll(async () => {
//     await db.sequelize.close();
//     server.close();
//   });
//   test("responds with json at /todos", async () => {
//     const response = await agent.post("/todos").send({
//       title: "Buy milk",
//       dueDate: new Date().toISOString(),
//       completed: false,
//     });
//     expect(response.statusCode).toBe(200);
//     expect(response.header["content-type"]).toBe(
//       "application/json; charset=utf-8"
//     );
//     const parsedResponse = JSON.parse(response.text);
//     expect(parsedResponse.id).toBeDefined();
//   });
//   test("Mark a todo as complete", async () => {
//     const response = await agent.post("/todos").send({
//       title: "Buy milk",
//       dueDate: new Date().toISOString(),
//       completed: false,
//     });
//     const parsedResponse = JSON.parse(response.text);
//     const todoID = parsedResponse.id;

//     expect(parsedResponse.completed).toBe(false);

//     const markCompletedResponse = await agent
//       .put(`/todos/${todoID}/markAsCompleted`)
//       .send();
//     const parsedUpdatedResponse = JSON.parse(markCompletedResponse.text);
//     expect(parsedUpdatedResponse.completed).toBe(true);
//   });}]
// });
