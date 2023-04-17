/* eslint-disable no-unused-vars */
// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const todaydate = new Date();

  const today = new Date().toISOString().split("T")[0];
  //new Date().toISOString().slice(0.10);

  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static associate(models) {
      // define association here
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("overdue");

      const overduethings = await this.overdue();
      const overduelist = overduethings.map((items) =>
        items.displayableString()
      );
      console.log(overduelist.join("\n").trim());
      console.log("\n");

      console.log("Due Today");
      //console.log(today);
      const todayduethings = await this.dueToday();
      const todayduelist = todayduethings.map((item) =>
        item.displayableString()
      );
      console.log(todayduelist.join("\n").trim());
      console.log("\n");

      console.log("Due Later");
      const laterduethings = await this.dueLater();
      const laterduelist = laterduethings.map((item) =>
        item.displayableString()
      );
      console.log(laterduelist.join("\n").trim());
    }

    static async overdue() {
      const overdueItems = await this.findAll({
        where: {
          dueDate: { [Op.lt]: today },
        },
      });
      return overdueItems;
    }
    static async dueToday() {
      const todaydueItems = await this.findAll({
        where: {
          dueDate: today,
        },
      });
      return todaydueItems;
    }
    static async dueLater() {
      const laterdueItems = await this.findAll({
        where: {
          dueDate: { [Op.gt]: today },
        },
      });
      return laterdueItems;
    }
    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      //console.log(this.dueDate, today)
      if (this.dueDate === today) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
