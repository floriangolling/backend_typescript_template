import TodoService, { TodoServiceError } from "@services/todo";
import TodoFactory from "@tests/factory/factory.todo";
import UserFactory from "@tests/factory/factory.user";
import { truncateAllTables } from "@tests/utils";

describe("SERVICE - Todos - deleteTodoById", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should delete the todo", async () => {
    const user = await UserFactory();
    const todo = await TodoFactory(user);

    const deletedTodo = await TodoService.deleteTodoById(todo.id, user.id);

    deletedTodo.should.be.eq(1);
  });

  it("should throw an error if the todo is not found", async () => {
    const user = await UserFactory();

    try {
      await TodoService.deleteTodoById(1, user.id);
    } catch (err) {
      if (err instanceof TodoServiceError) {
        err.should.be.an("error");
        return;
      } else {
        throw err;
      }
    }
    throw new Error("Should have thrown an error");
  });

  it("should throw an error if the todo is not user todo", async () => {
    const user = await UserFactory();
    const userTwo = await UserFactory();
    const todo = await TodoFactory(user);

    try {
      await TodoService.deleteTodoById(todo.id, userTwo.id);
    } catch (err) {
      if (err instanceof TodoServiceError) {
        err.should.be.an("error");
        return;
      } else {
        throw err;
      }
    }
    throw new Error("Should have thrown an error");
  });
});
