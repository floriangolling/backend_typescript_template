import { expect } from "chai";

describe("Config Environment Variables", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should load development config by default", () => {
    process.env.NODE_ENV = "development";
    delete require.cache[require.resolve("@config")];
    const config = require("@config").default;
    expect(config.NODE_ENV).to.equal("development");
  });

  it("should load test env when NODE_ENV is 'test'", () => {
    process.env.NODE_ENV = "test";
    delete require.cache[require.resolve("@config")];
    const config = require("@config").default;
    expect(config.NODE_ENV).to.equal("test");
  });

  it("should load test_mocha env when NODE_ENV is 'test_mocha'", () => {
    process.env.NODE_ENV = "test_mocha";
    delete require.cache[require.resolve("@config")];
    const config = require("@config").default;
    expect(config.NODE_ENV).to.equal("test_mocha");
  });
});
