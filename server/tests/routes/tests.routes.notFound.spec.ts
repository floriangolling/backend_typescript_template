import app from "@index";
import { chai, truncateAllTables } from "@tests/utils";

describe("ROUTE - * - notFound - *", () => {
  beforeEach(async () => {
    const tr = await truncateAllTables();
    return tr;
  });

  it("should return 404 for a route that does not exist", async () => {
    const res = await chai.request(app).get("/doesnotexist");
    res.should.have.status(404);
  });
});
