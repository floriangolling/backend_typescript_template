import UserService, { UserServiceError, UserServiceErrorType } from "@services/user";
import HTTPError from "@type/type.error";
import { Request, Response } from "express";

const ServiceErrorHTTP = {
  [UserServiceErrorType.USER_NOT_FOUND]: { status: 404, message: "User not found" },
  [UserServiceErrorType.INVALID_PASSWORD]: { status: 401, message: "Invalid password" },
  [UserServiceErrorType.USER_ALREADY_EXIST]: { status: 400, message: "User already exist" },
};

class AuthentificationController {
  static async login(req: Request, res: Response) {
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

  static async register(req: Request, res: Response) {
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
