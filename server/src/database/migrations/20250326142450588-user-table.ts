import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    queryInterface.createTable("user", {
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
    });
  },
  down: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    queryInterface.dropTable("user");
  },
};
