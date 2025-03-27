import Logger from "@/utils/utils.logger";
import { expect } from "chai";
import sinon from "sinon";

describe("Logger", () => {
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  let consoleWarnStub: sinon.SinonStub;
  let consoleDebugStub: sinon.SinonStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
    consoleWarnStub = sinon.stub(console, "warn");
    consoleDebugStub = sinon.stub(console, "debug");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should log messages correctly", () => {
    Logger.log("Test log message");
    expect(consoleLogStub.calledOnce).to.be.true;
    expect(consoleLogStub.firstCall.args[0]).to.include("[LOG]");
    expect(consoleLogStub.firstCall.args[0]).to.include("Test log message");
  });

  it("should log info messages correctly", () => {
    Logger.info("Test info message");
    expect(consoleLogStub.calledOnce).to.be.true;
    expect(consoleLogStub.firstCall.args[0]).to.include("[INFO]");
    expect(consoleLogStub.firstCall.args[0]).to.include("Test info message");
  });

  it("should log error messages correctly", () => {
    Logger.error("Test error message");
    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.include("[ERROR]");
    expect(consoleErrorStub.firstCall.args[0]).to.include("Test error message");
  });

  it("should log warning messages correctly", () => {
    Logger.warn("Test warn message");
    expect(consoleWarnStub.calledOnce).to.be.true;
    expect(consoleWarnStub.firstCall.args[0]).to.include("[WARN]");
    expect(consoleWarnStub.firstCall.args[0]).to.include("Test warn message");
  });

  it("should log debug messages correctly", () => {
    Logger.debug("Test debug message");
    expect(consoleDebugStub.calledOnce).to.be.true;
    expect(consoleDebugStub.firstCall.args[0]).to.include("[DEBUG]");
    expect(consoleDebugStub.firstCall.args[0]).to.include("Test debug message");
  });
});
