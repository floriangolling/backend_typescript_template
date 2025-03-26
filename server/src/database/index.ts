import { Sequelize } from "sequelize";

import Config from "@config";
import * as Models from "@database/models";
import Logger from "@utils/utils.logger";

export default async (sequelize: Sequelize) => {
  Object.values(Models).forEach((model) => {
    model.definition(sequelize);
  });

  Object.values(Models).forEach((model) => {
    model.associate();
  });
  await sequelize.authenticate();
  Logger.info("Connection has been established successfully.");
};

export const sequelize = new Sequelize(Config.POSTGRES_URL, {
  logging: Config.DATABASE_LOGGING,
});
