import TodoService, { TodoServiceError } from "@services/todo";
import TodoFactory from "@tests/factory/factory.todo";
import UserFactory from "@tests/factory/factory.user";
import { truncateAllTables } from "@tests/utils";

describe("SERVICE - Todos - updateTodo", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should update the todo", async () => {
    const user = await UserFactory();
    const todo = await TodoFactory(user);

    const updatedTodo = await TodoService.updateTodo({ completed: true }, todo.id, user.id);

    updatedTodo.should.be.an("object");
    updatedTodo.should.have.property("id").eq(todo.id);
    updatedTodo.should.have.property("title").eq(todo.title);
    updatedTodo.should.have.property("description").eq(todo.description);
    updatedTodo.should.have.property("completed").eq(true);
    updatedTodo.should.have.property("userId").eq(user.id);
  });

  it("should throw an error if the todo is not found", async () => {
    const user = await UserFactory();

    try {
      await TodoService.updateTodo({ completed: true }, 1, user.id);
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
      await TodoService.updateTodo({ completed: true }, todo.id, userTwo.id);
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
