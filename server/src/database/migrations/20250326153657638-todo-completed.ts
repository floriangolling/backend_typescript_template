import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    queryInterface.addColumn("todo", "completed", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
  down: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    queryInterface.removeColumn("todo", "completed");
  },
};
