import UserModel from "@database/models/database.models.user";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface TodoAttributes {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

interface TodoCreationsAttributes
  extends Optional<TodoAttributes, "id" | "createdAt" | "updatedAt" | "completed"> {}

export default class TodoModel extends Model<TodoAttributes, TodoCreationsAttributes> {
  public static definition(sequelize: Sequelize) {
    TodoModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        completed: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: UserModel,
            key: "id",
          },
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
        tableName: "todo",
        sequelize,
      },
    );
  }

  public static associate() {
    TodoModel.belongsTo(UserModel, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  }

  public title!: string;

  public description!: string;

  public completed!: boolean;

  public id!: number;

  public userId!: number;

  public createdAt!: Date;

  public updatedAt!: Date;
}

/**
 * @typedef Todo
 * @property {string} title
 * @property {string} description
 * @property {boolean} completed
 * @property {number} userId
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} id
 */
