import TodoService from "@services/todo";
import UserFactory from "@tests/factory/factory.user";
import { truncateAllTables } from "@tests/utils";

describe("SERVICE - Todos - createTodoForUser", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should create a new todo for the user", async () => {
    const user = await UserFactory();
    const todo = await TodoService.createTodoForUser(
      { title: "Test Todo", description: "desc" },
      user.id,
    );

    todo.should.be.an("object");
    todo.should.have.property("title").eq("Test Todo");
    todo.should.have.property("description").eq("desc");
    todo.should.have.property("completed").eq(false);
    todo.should.have.property("userId").eq(user.id);
  });

  it("should exist in the database", async () => {
    const user = await UserFactory();
    const todo = await TodoService.createTodoForUser(
      { title: "Test Todo", description: "desc" },
      user.id,
    );
    const todoFromDB = await TodoService.findById(todo.id);

    if (!todoFromDB) {
      throw new Error("Todo not found");
    }

    todoFromDB.should.be.an("object");
    todoFromDB.should.have.property("title").eq("Test Todo");
    todoFromDB.should.have.property("description").eq("desc");
    todoFromDB.should.have.property("completed").eq(false);
    todoFromDB.should.have.property("userId").eq(user.id);
  });
});
