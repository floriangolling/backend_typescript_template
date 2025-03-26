import app from "@index";
import UserFactory from "@tests/factory/factory.user";
import { chai, generateTokenForUser, truncateAllTables } from "@tests/utils";

describe("ROUTE - Todos - createTodo - POST /api/todos", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should return 403 if token is missing", async () => {
    const res = await chai
      .request(app)
      .post("/api/todos")
      .send({ title: "Test Todo", description: "desc" });
    res.should.have.status(403);
  });

  it("should return 404 if the user is not found", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    await user.destroy();

    const res = await chai
      .request(app)
      .post("/api/todos")
      .set("Authorization", token)
      .send({ title: "Test Todo", description: "desc" });
    res.should.have.status(404);
  });

  it("should return 400 because the title is missing", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    const res = await chai
      .request(app)
      .post("/api/todos")
      .set("Authorization", token)
      .send({ description: "desc" });
    res.should.have.status(400);
  });

  it("should return 400 because the description is missing", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    const res = await chai
      .request(app)
      .post("/api/todos")
      .set("Authorization", token)
      .send({ title: "Test Todo" });
    res.should.have.status(400);
  });

  it("should return 201 and create a new todo", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    const res = await chai
      .request(app)
      .post("/api/todos")
      .set("Authorization", token)
      .send({ title: "Test Todo", description: "desc" });
    res.should.have.status(201);
    res.body.should.have.property("id");
    res.body.should.have.property("title", "Test Todo");
  });
});
