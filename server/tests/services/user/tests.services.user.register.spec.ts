import { faker } from "@faker-js/faker";
import UserService, { UserServiceError } from "@services/user";
import { truncateAllTables } from "@tests/utils";

describe("SERVICE - User - register", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should register a user", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const user = await UserService.register({ email, password });

    user.should.be.an("object");
    user.should.have.property("email").eq(email);
  });

  it("should throw an error if the email is already taken", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await UserService.register({ email, password });

    try {
      await UserService.register({ email, password });
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
