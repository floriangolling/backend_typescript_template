import app from "@index";
import TodoService from "@services/todo";
import TodoFactory from "@tests/factory/factory.todo";
import UserFactory from "@tests/factory/factory.user";
import { chai, generateTokenForUser, truncateAllTables } from "@tests/utils";
import sinon from "sinon";

describe("ROUTE - Todos - deleteTodo - DELETE /api/todos/:id", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 403 if token is missing", async () => {
    const res = await chai.request(app).delete("/api/todos/1");
    res.should.have.status(403);
  });

  it("should return 403 because the ressource is not owned by the user", async () => {
    const user = await UserFactory();
    const user2 = await UserFactory();
    const todo = await TodoFactory(user2);
    const token = await generateTokenForUser(user);
    const res = await chai.request(app).delete(`/api/todos/${todo.id}`).set("Authorization", token);
    res.should.have.status(403);
  });

  it("should return 404 if the user is not found", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    await user.destroy();

    const res = await chai.request(app).delete("/api/todos/1").set("Authorization", token);
    res.should.have.status(404);
  });

  it("should return 400 because the id is not a number", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    const res = await chai.request(app).delete("/api/todos/abc").set("Authorization", token);
    res.should.have.status(400);
  });

  it("should return 404 if the todo does not exist", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    const res = await chai.request(app).delete("/api/todos/999").set("Authorization", token);
    res.should.have.status(404);
  });

  it("should return 204 and delete the todo", async () => {
    const user = await UserFactory();
    const todo = await TodoFactory(user);
    const token = await generateTokenForUser(user);
    const res = await chai.request(app).delete(`/api/todos/${todo.id}`).set("Authorization", token);
    res.should.have.status(204);
  });

  it("should return 500 if an error occured", async () => {
    const user = await UserFactory();
    const todo = await TodoFactory(user);
    const token = await generateTokenForUser(user);
    const stub = sinon.stub(TodoService, "deleteTodoById").throws(new Error());
    const res = await chai.request(app).delete(`/api/todos/${todo.id}`).set("Authorization", token);
    res.should.have.status(500);
  });
});
