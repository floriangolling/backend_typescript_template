import TodoModel from "@/database/models/database.models.todo";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { ApiModel, ApiModelProperty } from "swagger-express-ts";

interface UserAttributes {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

@ApiModel({
  description: "User model",
  name: "User",
})
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

  @ApiModelProperty({
    description: "User password",
    required: true,
    type: "string",
    format: "password",
  })
  public password!: string;

  @ApiModelProperty({
    description: "User email",
    required: true,
    type: "string",
    format: "email",
  })
  public email!: string;

  @ApiModelProperty({
    description: "User id",
    required: true,
    type: "number",
  })
  public id!: number;

  @ApiModelProperty({
    description: "User todos",
    required: false,
    type: "array",
    itemType: "Todo",
  })
  public readonly todos?: TodoModel[];

  @ApiModelProperty({
    description: "User creation date",
    required: true,
    type: "date",
  })
  public createdAt!: Date;

  @ApiModelProperty({
    description: "User update date",
    required: true,
    type: "date",
  })
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
