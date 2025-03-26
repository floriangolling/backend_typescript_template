import { TodoModel, UserModel } from "@database/models";
import { faker } from "@faker-js/faker";

const TodoFactory = async (user: UserModel) => {
  return TodoModel.create({
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    userId: user.id,
  });
};

export default TodoFactory;
