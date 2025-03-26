import Config from "@config";
import * as Models from "@database/models";
import chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import { Model, ModelStatic } from "sequelize";

chai.use(chaiHttp);

const should = chai.should();

export const truncateAllTables = async () => {
  const modelList: ModelStatic<Model>[] = Object.values(Models) as ModelStatic<Model>[];

  await Promise.allSettled(
    modelList.map(async (model) => {
      await model.truncate({
        cascade: true,
      });
    }),
  );
};

export const generateTokenForUser = async (user: Models.UserModel) => {
  const jwtToken = jwt.sign({ email: user.email, id: user.id }, Config.JWT_SECRET, {
    expiresIn: "24h",
  });
  return jwtToken;
};

export { chai, should };
