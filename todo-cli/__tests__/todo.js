/* eslint-disable no-undef */
//import todoList from '../todo';

const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("TodoList Test Suite", () => {
  beforeAll(() => {
    add({
      title: "testing todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });

  test("should add new todo", () => {
    const todocount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
    });
    expect(all.length).toBe(todocount + 1);
  });

  const Dateformating = (d) => {
    return d.toISOString().split("T")[0];
  };

  const todaydate = new Date();

  const yesterday = Dateformating(
    new Date(new Date().setDate(todaydate.getDate() - 1))
  );

  const tomorrow = Dateformating(
    new Date(new Date().setDate(todaydate.getDate() + 1))
  );

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should get overdue items", () => {
    const dueitemscount = overdue.length;
    const dueitems = {
      title: "Test overdue",
      completed: false,
      dueDate: yesterday,
    };
    add(dueitems);
    expect(overdue().length).toBe(dueitemscount + 1);
  });

  test("should get today due items", () => {
    const duetodayitemscount = dueToday().length;
    const dueitems = {
      title: "Test today",
      completed: false,
      dueDate: Dateformating(todaydate),
    };
    add(dueitems);
    const todayitems = dueToday();
    expect(todayitems.length).toBe(duetodayitemscount + 1);
  });

  test("Should retrieve Later due items", () => {
    const dueitemslater = dueLater.length;
    const dueitems = {
      title: "Test dueLater",
      completed: false,
      dueDate: tomorrow,
    };
    add(dueitems);
    expect(dueLater().length).toBe(dueitemslater + 1);
  });
});
