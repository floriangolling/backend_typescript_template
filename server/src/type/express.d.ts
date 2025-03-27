import { Request } from "express";

interface MiddlewareUser {
  id: number;
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: MiddlewareUser;
  }
}
