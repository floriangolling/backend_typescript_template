import TodoModel from "@/database/models/database.models.todo";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface UserAttributes {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

export default class UserModel extends Model<UserAttributes, UserCreationAttributes> {
  public static definition(sequelize: Sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: "user",
        sequelize,
      },
    );
  }

  public static associate() {
    UserModel.hasMany(TodoModel, {
      foreignKey: "userId",
      as: "todos",
      onDelete: "CASCADE",
    });
  }

  public password!: string;

  public email!: string;

  public id!: number;

  public readonly todos?: TodoModel[];

  public createdAt!: Date;

  public updatedAt!: Date;
}

/**
 * @typedef User
 * @property {string} email
 * @property {string} password
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} id
 */
