import middlewareJwt from "@middlewares/middlewares.jwt";
import AuthentificationRouter from "@routes/authentification";
import TodosRouter from "@routes/todos";
import { Router } from "express";

const apiRouter = Router();

/* PUBLIC ROUTES */

apiRouter.use("/auth", AuthentificationRouter);

apiRouter.use(middlewareJwt);

/* PROTECTED ROUTES */

apiRouter.use("/todos", TodosRouter);

export default apiRouter;
