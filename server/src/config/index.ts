import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

const MOCHA_PATH = path.resolve(__dirname, "../../tests/docker/test.env");
const DIST_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "server",
  "tests",
  "docker",
  "test.env",
);

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: DIST_PATH });
} else if (process.env.NODE_ENV === "test_mocha") {
  dotenv.config({ path: MOCHA_PATH });
} else {
  dotenv.config();
}

const envSchema = z.object({
  PORT: z.string().default("5001").transform(Number),
  HOST: z.string().default("localhost"),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string().transform(Number),
  POSTGRES_DB: z.string(),
  DATABASE_LOGGING: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  JWT_SECRET: z.string().default("secret"),
  NODE_ENV: z.string().default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

const env = envSchema.parse(process.env);

class Config {
  public static readonly PORT = env.PORT;
  public static readonly HOST = env.HOST;
  public static readonly POSTGRES_URL =
    `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
  public static readonly DATABASE_LOGGING = env.DATABASE_LOGGING;
  public static readonly JWT_SECRET = env.JWT_SECRET;
  public static readonly NODE_ENV = env.NODE_ENV;
  public static readonly CORS_ORIGIN = env.CORS_ORIGIN;
  public static readonly TEST = env.NODE_ENV === "test" || env.NODE_ENV === "test_mocha";
}

export default Config;
