import app from "@index";
import TodoFactory from "@tests/factory/factory.todo";
import UserFactory from "@tests/factory/factory.user";
import { chai, generateTokenForUser, truncateAllTables } from "@tests/utils";

describe("ROUTE - Todos - getUserTodos - GET /api/todos", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should return 403 if token is missing", async () => {
    const res = await chai.request(app).get("/api/todos");
    res.should.have.status(403);
  });

  it("should return 404 if the user is not found", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);

    await user.destroy();

    const res = await chai.request(app).get("/api/todos").set("Authorization", token);
    res.should.have.status(404);
  });

  it("should return 200 with an empty array if the user has no todos", async () => {
    const user = await UserFactory();
    const token = await generateTokenForUser(user);
    const res = await chai.request(app).get("/api/todos").set("Authorization", token);
    res.should.have.status(200);
    res.body.should.be.a("array");
    res.body.should.have.lengthOf(0);
  });

  it("should return 200 with the user todos", async () => {
    const user = await UserFactory();
    await TodoFactory(user);
    await TodoFactory(user);
    await TodoFactory(user);
    const token = await generateTokenForUser(user);
    const res = await chai.request(app).get("/api/todos").set("Authorization", token);
    res.should.have.status(200);
    res.body.should.be.a("array");
    res.body.should.have.lengthOf(3);
  });
});
