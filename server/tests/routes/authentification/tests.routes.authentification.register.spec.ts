import app from "@index";
import UserService from "@services/user";
import UserFactory from "@tests/factory/factory.user";
import { chai, truncateAllTables } from "@tests/utils";
import sinon from "sinon";

describe("ROUTE - Authentification - register - POST /api/auth/register", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if email is missing", async () => {
    const res = await chai.request(app).post("/api/auth/register").send({ password: "password" });
    res.should.have.status(400);
  });

  it("should return 400 if password is missing", async () => {
    const res = await chai.request(app).post("/api/auth/register").send({ email: "email" });
    res.should.have.status(400);
  });

  it("should return 400 if the user already exist with this email", async () => {
    const user = await UserFactory();
    const res = await chai
      .request(app)
      .post("/api/auth/register")
      .send({ email: user.email, password: "password" });
    res.should.have.status(400);
  });

  it("should return 200 if the user is registered", async () => {
    const res = await chai
      .request(app)
      .post("/api/auth/register")
      .send({ email: "email@email.fr", password: "password" });
    res.should.have.status(200);
  });

  it("should return 500 if an unexpected error occurs", async () => {
    const unexpectedError = new Error("Unexpected error");
    sinon.stub(UserService, "register").throws(unexpectedError);
    const res = await chai
      .request(app)
      .post("/api/auth/register")
      .send({ email: "email@email.fr", password: "password" });
    res.should.have.status(500);
  });
});
