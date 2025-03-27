import HTTPError from "@type/type.error";
import Logger from "@utils/utils.logger";
import { NextFunction, Request, Response } from "express";

export default (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HTTPError) {
    Logger.error(err.message);
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  Logger.error(err.message);
  return res.status(500).send({
    message: "Internal server error",
  });
};
