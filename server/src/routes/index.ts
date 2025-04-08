import middlewareJwt from "@middlewares/middlewares.jwt";
import AuthentificationRouter from "@routes/authentification";
import TodosRouter from "@routes/todos";
import Swagger from "@swagger/index";
import express, { Router } from "express";
import * as swagger from "swagger-express-ts";

const apiRouter = Router();

/* PUBLIC ROUTES */

apiRouter.use("/api-docs/swagger", express.static("src/swagger"));

apiRouter.use("/api-docs/swagger/assets", express.static("node_modules/swagger-ui-dist"));

apiRouter.use(swagger.express(Swagger));

apiRouter.use("/auth", AuthentificationRouter);

apiRouter.use(middlewareJwt);

/* PROTECTED ROUTES */

apiRouter.use("/todos", TodosRouter);

export default apiRouter;
