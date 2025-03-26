import Config from "@config";
import UserService, { UserServiceError, UserServiceErrorType } from "@services/user";
import HTTPError from "@type/type.error";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new HTTPError("Token missing", 403);
  }

  const decoded = jwt.verify(token, Config.JWT_SECRET) as {
    email: string;
    id: number;
  };
  req.user = { email: decoded.email, id: decoded.id };

  const user = await UserService.findById(decoded.id);
  if (!user) {
    throw new HTTPError("User not found", 404);
  }

  return next();
};
