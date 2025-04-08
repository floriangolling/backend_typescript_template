import cors from "cors";
import express from "express";

import "express-async-errors";
import "reflect-metadata";
import Config from "@config";
import ConnectToDatabase, { sequelize } from "@database";
import ErrorWrapper from "@middlewares/middlewares.error";
import Router from "@routes";
import Logger from "@utils/utils.logger";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: Config.CORS_ORIGIN }));

app.use("/api", Router);

app.all("*", (_req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use(ErrorWrapper);

export const startServer = async () => {
  await ConnectToDatabase(sequelize);

  const server = app.listen(Config.PORT, Config.HOST, () => {
    Logger.info(`Server is running on http://${Config.HOST}:${Config.PORT}`);
  });

  return server;
};

export default app;
