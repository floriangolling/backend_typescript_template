import Config from "@config";
import { UserModel } from "@database/models";
import BaseService from "@services/baseService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export enum UserServiceErrorType {
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
  INVALID_PASSWORD,
}

export class UserServiceError extends Error {
  public reason: UserServiceErrorType;

  constructor(reason: UserServiceErrorType) {
    super(`userservice_reason_${reason}`);
    this.reason = reason;
  }
}

class UserService extends BaseService<UserModel> {
  constructor() {
    super(UserModel);
  }

  // ----------------------------------------------------------------------------------

  async register(data: Pick<UserModel, "email" | "password">) {
    const user = await this.findOne({ where: { email: data.email } });

    if (user) {
      throw new UserServiceError(UserServiceErrorType.USER_ALREADY_EXIST);
    }
    const password = await bcrypt.hash(data.password, 10);
    return this.create({ ...data, password });
  }

  // ----------------------------------------------------------------------------------

  async login(data: Pick<UserModel, "email" | "password">) {
    const user = await this.findOne({ where: { email: data.email } });
    if (!user) {
      throw new UserServiceError(UserServiceErrorType.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UserServiceError(UserServiceErrorType.INVALID_PASSWORD);
    }
    const token = await this.generateToken(user);
    return token;
  }

  // ----------------------------------------------------------------------------------

  async generateToken(user: UserModel) {
    return jwt.sign({ email: user.email, id: user.id }, Config.JWT_SECRET, { expiresIn: "24h" });
  }
}

export default new UserService();
