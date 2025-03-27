import TodoService from "@services/todo";
import TodoFactory from "@tests/factory/factory.todo";
import UserFactory from "@tests/factory/factory.user";
import { truncateAllTables } from "@tests/utils";

describe("SERVICE - Todos - getUserTodo", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should return an empty array if the user has no todos", async () => {
    const user = await UserFactory();

    const todos = await TodoService.getUserTodos(user.id);

    todos.should.be.an("array");
    todos.should.have.lengthOf(0);
  });

  it("should return an array of todos if the user has todos", async () => {
    const user = await UserFactory();

    const updatedTodo = await TodoFactory(user);
    await TodoFactory(user);
    updatedTodo.set("completed", true);
    await updatedTodo.save();

    const todos = await TodoService.getUserTodos(user.id);

    todos.should.be.an("array");
    todos.should.have.lengthOf(2);
  });

  it("should return only the completed todos if the user has completed todos", async () => {
    const user = await UserFactory();

    const todoOne = await TodoFactory(user);
    await TodoFactory(user);
    todoOne.set("completed", true);
    await todoOne.save();

    const todos = await TodoService.getUserTodos(user.id, true);

    todos.should.be.an("array");
    todos.should.have.lengthOf(1);
  });

  it("should return only the uncompleted todos if the user has uncompleted todos", async () => {
    const user = await UserFactory();

    const todoOne = await TodoFactory(user);
    await TodoFactory(user);

    todoOne.set("completed", true);
    await todoOne.save();

    const todos = await TodoService.getUserTodos(user.id, false);

    todos.should.be.an("array");
    todos.should.have.lengthOf(1);
  });
});
