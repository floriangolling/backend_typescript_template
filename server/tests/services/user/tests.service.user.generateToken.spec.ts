import Config from "@config";
import UserService from "@services/user";
import UserFactory from "@tests/factory/factory.user";
import { truncateAllTables } from "@tests/utils";
import jwt from "jsonwebtoken";

describe("SERVICE - User - generateToken", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should generate a token for the user", async () => {
    const user = await UserFactory();

    const token = await UserService.generateToken(user);
    token.should.be.an("string");
    const decoded = jwt.verify(token, Config.JWT_SECRET) as { id: number };
    decoded.should.be.an("object");
    decoded.should.have.property("id").eq(user.id);
  });
});
