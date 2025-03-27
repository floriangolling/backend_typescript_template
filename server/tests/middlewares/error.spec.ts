import errorMiddleware from "@/middlewares/middlewares.error";
import HTTPError from "@type/type.error";
import Logger from "@utils/utils.logger";
import { expect } from "chai";
import express, { Response } from "express";
import sinon from "sinon";

interface MockResponse extends Response {
  status: sinon.SinonStub;
  send: sinon.SinonStub;
}

describe("MIDDLEWARE - Error", () => {
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    consoleErrorStub = sinon.stub(Logger, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 500 for an unknown error", () => {
    const req = {} as express.Request;
    const res: MockResponse = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    } as unknown as MockResponse;
    const next = sinon.stub();

    errorMiddleware(new Error("Unknown error"), req, res, next);

    expect(res.status.called).to.be.true;
    expect(res.status.args[0][0]).to.equal(500);
    expect(res.send.called).to.be.true;
    expect(res.send.args[0][0]).to.deep.equal({ message: "Internal server error" });
    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal("Unknown error");
  });

  it("should return the correct status and message for HTTPError", () => {
    const req = {} as express.Request;
    const res: MockResponse = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    } as unknown as MockResponse;
    const next = sinon.stub();

    const httpError = new HTTPError("Test HTTP error", 400);
    errorMiddleware(httpError, req, res, next);

    expect(res.status.called).to.be.true;
    expect(res.status.args[0][0]).to.equal(400);
    expect(res.send.called).to.be.true;
    expect(res.send.args[0][0]).to.deep.equal({ message: "Test HTTP error" });
    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal("Test HTTP error");
  });
});
