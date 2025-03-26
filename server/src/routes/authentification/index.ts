import AuthentificationController from "@controllers/authentification";
import { Router } from "express";

const AuthentificationRouter = Router();

/**
 * @route POST /api/auth/login
 * @group Authentification
 * @param {string} email.body.required - User email
 * @param {string} password.body.required - User password
 * @returns {object} 200 - User token
 * @returns {Error} 400 - Bad request
 * @returns {Error} 401 - Invalid password
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
AuthentificationRouter.post("/login", AuthentificationController.login);

/**
 * @route POST /api/auth/register
 * @group Authentification
 * @param {string} email.body.required - User email
 * @param {string} password.body.required - User password
 * @returns {object} 200 - User token
 * @returns {Error} 400 - Bad request
 * @returns {Error} 400 - User already exist
 * @returns {Error} 500 - Internal server error
 */
AuthentificationRouter.post("/register", AuthentificationController.register);

export default AuthentificationRouter;
