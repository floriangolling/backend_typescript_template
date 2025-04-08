import UserService, { UserServiceError, UserServiceErrorType } from "@services/user";
import HTTPError from "@type/type.error";
import { Request, Response } from "express";
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from "swagger-express-ts";
import { z } from "zod";

const ServiceErrorHTTP = {
  [UserServiceErrorType.USER_NOT_FOUND]: { status: 404, message: "User not found" },
  [UserServiceErrorType.INVALID_PASSWORD]: { status: 401, message: "Invalid password" },
  [UserServiceErrorType.USER_ALREADY_EXIST]: { status: 400, message: "User already exist" },
};

@ApiPath({
  name: "Authentification",
  path: "/api/auth",
  description: "Authentification",
})
class AuthentificationController {
  // ----------------------------------------------------------------------------------

  static loginSchema = z.object({
    email: z.string().email("invalid email format"),
    password: z.string().min(8, "password must be at least 8 characters long"),
  });

  @ApiOperationPost({
    path: "/login",
    description: "Login",
    parameters: {
      body: {
        properties: {
          email: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
          password: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
        },
      },
    },
    responses: {
      200: { type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "TokenResponse" },
      400: { description: "Bad request" },
      401: { description: "Invalid password" },
      404: { description: "User not found" },
      500: { description: "Internal server error" },
    },
  })
  public async login(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      throw new HTTPError("Bad request", 400);
    }

    try {
      const token = await UserService.login({ email, password });
      res.json({ token });
    } catch (err) {
      if (err instanceof UserServiceError && ServiceErrorHTTP[err.reason]) {
        const { status, message } = ServiceErrorHTTP[err.reason];
        throw new HTTPError(message, status);
      }
      throw err;
    }
  }

  // ----------------------------------------------------------------------------------

  static registerSchema = z.object({
    email: z.string().email("invalid email format"),
    password: z.string().min(8, "password must be at least 8 characters long"),
  });

  @ApiOperationPost({
    path: "/register",
    description: "Register",
    parameters: {
      body: {
        properties: {
          email: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
          password: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
        },
      },
    },
    responses: {
      200: { type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "TokenResponse" },
      400: { description: "Bad request" },
      500: { description: "Internal server error" },
    },
  })
  public async register(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      throw new HTTPError("Bad request", 400);
    }

    try {
      const user = await UserService.register({ email, password });
      const token = await UserService.generateToken(user);
      res.json({ token });
    } catch (err) {
      if (err instanceof UserServiceError && ServiceErrorHTTP[err.reason]) {
        const { status, message } = ServiceErrorHTTP[err.reason];
        throw new HTTPError(message, status);
      }
      throw err;
    }
  }
}

export default AuthentificationController;
