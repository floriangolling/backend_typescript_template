import AuthentificationController from "@controllers/authentification";
import { Router } from "express";

const AuthentificationControllerInstance = new AuthentificationController();
const AuthentificationRouter = Router();

// ----------------------------------------------------------------------------------

AuthentificationRouter.post("/login", AuthentificationControllerInstance.login);

// ----------------------------------------------------------------------------------

AuthentificationRouter.post("/register", AuthentificationControllerInstance.register);

export default AuthentificationRouter;
