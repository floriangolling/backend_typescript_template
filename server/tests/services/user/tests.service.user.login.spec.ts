import Config from "@config";
import UserService, { UserServiceError } from "@services/user";
import UserFactory from "@tests/factory/factory.user";
import { truncateAllTables } from "@tests/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("SERVICE - User - login", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should generate a token for the user", async () => {
    const user = await UserFactory();
    const password = user.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.set("password", hashedPassword);
    await user.save();

    const token = await UserService.login({
      email: user.email,
      password,
    });
    token.should.be.an("string");
    const decoded = jwt.verify(token, Config.JWT_SECRET) as { id: number };
    decoded.should.be.an("object");
    decoded.should.have.property("id").eq(user.id);
  });

  it("should throw an error if the user is not found", async () => {
    const user = await UserFactory();
    const token = await UserService.generateToken(user);
    const userTwo = await UserFactory();
    try {
      await UserService.login({ email: userTwo.email, password: userTwo.password });
    } catch (err) {
      if (err instanceof UserServiceError) {
        err.should.be.an("error");
        return;
      } else {
        throw err;
      }
    }
    throw new Error("Should have thrown an error");
  });

  it("should throw an error if the password is incorrect", async () => {
    const user = await UserFactory();
    const token = await UserService.generateToken(user);
    try {
      await UserService.login({ email: user.email, password: "wrongpassword" });
    } catch (err) {
      if (err instanceof UserServiceError) {
        err.should.be.an("error");
        return;
      } else {
        throw err;
      }
    }
    throw new Error("Should have thrown an error");
  });
});
