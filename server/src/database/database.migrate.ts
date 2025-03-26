import fs from "fs";
import path from "path";
import { sequelize } from "@database";
import Logger from "@utils/utils.logger";
import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";

const umzug = new Umzug({
  migrations: {
    glob: ["migrations/*.js", { cwd: __dirname }],
    resolve: ({ name, path: migrationPath, context }) => {
      const migration = require(migrationPath!).default;
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

function createFile(name: string) {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "server",
    "src",
    "database",
    "migrations",
    `${timestamp}-${name}.ts`,
  );
  const fileContent = `import { QueryInterface, Sequelize, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    // Put your modifications here.
  },
  down: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    // Delete your modifications here.
  }
}`;

  try {
    fs.writeFileSync(filePath, fileContent);
    Logger.info(`Migration ${name} created successfully.`);
  } catch (err) {
    Logger.error("Error creating migration:", err);
  }
}

async function listExecutedMigrations() {
  try {
    const executedMigrations = await umzug.executed();
    Logger.info("Executed migrations:");
    executedMigrations.forEach((migration) => {
      Logger.info(migration.name);
    });
  } catch (error) {
    Logger.error("Error listing executed migrations:", error);
  }
}

async function performMigration(action: "up" | "down") {
  try {
    if (action === "up") {
      await umzug.up();
      Logger.info("Migrations applied successfully.");
    } else if (action === "down") {
      await umzug.down();
      Logger.info("Last migration reverted successfully.");
    }
    await listExecutedMigrations();
  } catch (err) {
    Logger.error(`Error performing ${action} migration:`, err);
  }
}

const command = process.argv[2];

if (command === "up" || command === "down") {
  performMigration(command);
} else if (command === "create") {
  const name = process.argv[3];
  if (!name) {
    Logger.error(
      "Please enter a name to create your new migration.\nExample: npm run db:create new_migration",
    );
  } else {
    createFile(name);
  }
}
