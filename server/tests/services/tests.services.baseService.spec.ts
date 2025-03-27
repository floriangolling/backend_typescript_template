import { faker } from "@faker-js/faker";
import UserService from "@services/user";
import UserFactory from "@tests/factory/factory.user";
import { truncateAllTables } from "@tests/utils";
import { expect } from "chai";
import jwt from "jsonwebtoken";

describe("SERVICE - BaseService", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should find all", async () => {
    const user = await UserFactory();
    const users = await UserService.findAll();
    expect(users).length(1);
    expect(users[0].id).eq(user.id);
  });

  it("should find by id", async () => {
    const user = await UserFactory();
    const userById = await UserService.findById(user.id);
    expect(userById?.id).eq(user.id);
  });

  it("should find one", async () => {
    const user = await UserFactory();
    const userByOne = await UserService.findOne();
    expect(userByOne?.id).eq(user.id);
  });

  it("should create", async () => {
    const newUser = await UserService.create({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const user = await UserService.findOne({ where: { id: newUser.id } });
    expect(user?.email).eq(newUser.email);
  });

  it("should update", async () => {
    const newEmail = faker.internet.email();
    const user = await UserFactory();
    const updatedUser = await UserService.update(
      { email: newEmail },
      {
        where: { id: user.id },
      },
    );
    const userById = await UserService.findById(user.id);
    expect(userById?.id).eq(user.id);
    expect(userById?.email).eq(newEmail);
  });

  it("should delete", async () => {
    const user = await UserFactory();
    await UserService.delete({ id: user.id });
    const userById = await UserService.findById(user.id);
    expect(userById).eq(null);
  });

  it("should count", async () => {
    await UserFactory();
    const count = await UserService.count();
    expect(count).eq(1);
  });

  it("should find or create", async () => {
    const user = await UserFactory();
    const [userFound, created] = await UserService.findOrCreate({
      where: { email: user.email },
      defaults: {
        email: user.email,
        password: faker.internet.password(),
      },
    });
    expect(userFound.id).eq(user.id);
    expect(created).eq(false);

    const newUserEmail = faker.internet.email();
    const [_userFoundTwo, createdTwo] = await UserService.findOrCreate({
      where: {
        email: newUserEmail,
      },
      defaults: {
        email: newUserEmail,
        password: faker.internet.password(),
      },
    });
    expect(createdTwo).eq(true);
  });
});
