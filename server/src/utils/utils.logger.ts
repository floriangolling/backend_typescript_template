import chalk from "chalk";

export default class Logger {
  private static getTimeStamp() {
    return `[${new Date().toISOString()}]`;
  }

  public static log(...messages: unknown[]) {
    console.log(`${chalk.green("[LOG]")} ${this.getTimeStamp()} ${messages.join(" ")}`);
  }

  public static info(...messages: unknown[]) {
    console.log(`${chalk.blue("[INFO]")} ${this.getTimeStamp()} ${messages.join(" ")}`);
  }

  public static error(...messages: unknown[]) {
    console.error(`${chalk.red("[ERROR]")} ${this.getTimeStamp()} ${messages.join(" ")}`);
  }

  public static warn(...messages: unknown[]) {
    console.warn(`${chalk.yellow("[WARN]")} ${this.getTimeStamp()} ${messages.join(" ")}`);
  }

  public static debug(...messages: unknown[]) {
    console.debug(`${chalk.magenta("[DEBUG]")} ${this.getTimeStamp()} ${messages.join(" ")}`);
  }
}
