import { UserModel } from "@database/models";
import { faker } from "@faker-js/faker";

const UserFactory = () => {
  return UserModel.create({
    email: faker.internet.email(),
    password: faker.internet.password(),
  });
};

export default UserFactory;
