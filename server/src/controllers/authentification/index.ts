import UserService, { UserServiceError, UserServiceErrorType } from "@services/user";
import HTTPError from "@type/type.error";
import { Request, Response } from "express";
import { z } from "zod";

const ServiceErrorHTTP = {
  [UserServiceErrorType.USER_NOT_FOUND]: { status: 404, message: "User not found" },
  [UserServiceErrorType.INVALID_PASSWORD]: { status: 401, message: "Invalid password" },
  [UserServiceErrorType.USER_ALREADY_EXIST]: { status: 400, message: "User already exist" },
};

class AuthentificationController {
  // ----------------------------------------------------------------------------------

  static loginSchema = z.object({
    email: z.string().email("invalid email format"),
    password: z.string().min(8, "password must be at least 8 characters long"),
  });

  static async login(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

    const schemaResult = AuthentificationController.loginSchema.safeParse({ email, password });

    if (!schemaResult.success) {
      const errors = schemaResult.error.errors.map((error) => error.message);
      throw new HTTPError(errors.join(", "), 400);
    }

    try {
      const token = await UserService.login(schemaResult.data);
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

  static async register(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

    const schemaResult = AuthentificationController.registerSchema.safeParse({ email, password });

    if (!schemaResult.success) {
      const errors = schemaResult.error.errors.map((error) => error.message);
      throw new HTTPError(errors.join(", "), 400);
    }

    try {
      const user = await UserService.register(schemaResult.data);
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
