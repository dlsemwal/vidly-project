const { User } = require("../../../models/user");
const { Genre } = require("../../../models/genre");
const request = require("supertest");
let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await Genre.deleteMany();
    server.close();
  });
  let token;
  let name;
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
    name = "genre1";
  });

  it("it should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid.", async () => {
    token = "invalid token";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid.", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
