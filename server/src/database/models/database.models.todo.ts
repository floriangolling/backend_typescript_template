import UserModel from "@database/models/database.models.user";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { ApiModel, ApiModelProperty } from "swagger-express-ts";

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

@ApiModel({
  description: "Todo model",
  name: "Todo",
})
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

  @ApiModelProperty({
    description: "Todo title",
    type: "string",
    required: true,
  })
  public title!: string;

  @ApiModelProperty({
    description: "Todo description",
    type: "string",
    required: true,
  })
  public description!: string;

  @ApiModelProperty({
    description: "Todo completed status",
    type: "boolean",
    required: false,
  })
  public completed!: boolean;

  @ApiModelProperty({
    description: "Todo creation date",
    type: "date",
    required: true,
  })
  public id!: number;

  @ApiModelProperty({
    description: "Todo user id",
    type: "number",
    required: true,
  })

  @ApiModelProperty({
    description: "Todo user id",
    type: "number",
    required: true,
  })
  public userId!: number;

  @ApiModelProperty({
    description: "Todo creation date",
    type: "date",
    required: true,
  })
  public createdAt!: Date;

  @ApiModelProperty({
    description: "Todo update date",
    type: "date",
    required: true,
  })
  public updatedAt!: Date;
}
