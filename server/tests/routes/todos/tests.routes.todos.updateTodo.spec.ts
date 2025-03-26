import app from "@index";
import TodoFactory from "@tests/factory/factory.todo";
import UserFactory from "@tests/factory/factory.user";
import { chai, generateTokenForUser, truncateAllTables } from "@tests/utils";

describe("ROUTE - Todos - updateTodo - PUT /api/todos/:id", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should return 403 if token is missing", async () => {
    const res = await chai.request(app).put("/api/todos/1").send({ completed: true });
    res.should.have.status(403);
  });

  it ('should return 403 because the ressource is not owned by the user', async () => {
    const user = await UserFactory();
    const user2 = await UserFactory();
    const todo = await TodoFactory(user2);
    const token = await generateTokenForUser(user);
    const res = await chai.request(app).put(`/api/todos/${todo.id}`).set("Authorization", token).send({ completed: true });
    res.should.have.status(403);
  });

  it ('should return 400 because the id is not a number', async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    const res = await chai.request(app).put("/api/todos/abc").set("Authorization", token).send({ completed: true });
    res.should.have.status(400);
  });

  it ('should return 400 because the completed field is not a boolean', async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    const res = await chai.request(app).put("/api/todos/1").set("Authorization", token).send({ completed: "lol" });
    res.should.have.status(400);
  });

  it("should return 404 if the user is not found", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    await user.destroy();

    const res = await chai
      .request(app)
      .put("/api/todos/1")
      .set("Authorization", token)
      .send({ completed: true });
    res.should.have.status(404);
  });

  it("should return 404 if the todo does not exist", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    const res = await chai
      .request(app)
      .put("/api/todos/999")
      .set("Authorization", token)
      .send({ completed: true });
    res.should.have.status(404);
  });

  it("should return 200 and update the todo", async () => {
    const user = await UserFactory();
    const todo = await TodoFactory(user);
    const token = await generateTokenForUser(user);
    const res = await chai
      .request(app)
      .put(`/api/todos/${todo.id}`)
      .set("Authorization", token)
      .send({ completed: true });
    res.should.have.status(200);
    res.body.should.have.property("completed", true);
  });
});
