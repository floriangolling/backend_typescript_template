import app from "@index";
import UserService from "@services/user";
import UserFactory from "@tests/factory/factory.user";
import { chai, truncateAllTables } from "@tests/utils";
import bcrypt from "bcrypt";
import sinon from "sinon";

describe("ROUTE - Authentification - login - POST /api/auth/login", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if email is missing", async () => {
    const res = await chai.request(app).post("/api/auth/login").send({ password: "password" });
    res.should.have.status(400);
  });

  it("should return 400 if password is missing", async () => {
    const res = await chai.request(app).post("/api/auth/login").send({ email: "email" });
    res.should.have.status(400);
  });

  it("should return 404 if the user is not found", async () => {
    const res = await chai
      .request(app)
      .post("/api/auth/login")
      .send({ email: "email@email.fr", password: "password" });
    res.should.have.status(404);
  });

  it("should return 401 if the password is invalid", async () => {
    const user = await UserFactory();
    const res = await chai
      .request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "password" });
    res.should.have.status(401);
  });

  it("should return 200 if the user is logged in", async () => {
    const password = "password";
    const user = await UserFactory();
    user.set("password", bcrypt.hashSync(password, 10));
    await user.save();
    const res = await chai
      .request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password });
    res.should.have.status(200);
  });

  it("should return 500 if an unexpected error occurs", async () => {
    const unexpectedError = new Error("Unexpected error");
    sinon.stub(UserService, "login").throws(unexpectedError);

    const res = await chai
      .request(app)
      .post("/api/auth/login")
      .send({ email: "email@email.fr", password: "password" });

    res.should.have.status(500);
  });
});
