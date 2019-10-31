const config = require("config");
const jwt = require("jsonwebtoken");
const request = require("supertest");

describe("api/auth", () => {
  let server;
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(() => {
    server.close();
  });

  describe("POST / for login", () => {
    it("should return 400 if  email or password has less than 5 characters.", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({ email: "1234", password: "1234" });

      expect(res.status).toBe(400);
    });

    it("should return return 400 if wrong email is provided.", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({ email: "abcd@gmail.com", password: "3576cdld" });

      expect(res.status).toBe(400);
    });

    it("should return token if email and password is correct", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({
          email: "divyanshu.semwal@neosofttech.com",
          password: "password"
        });

      expect(res.status).toBe(200);
      // const decoded = jwt.verify(res.body, config.get("jwtPrivateKey"));

      // expect(decoded).toHaveProperty("_id");
      // expect(decoded).toHaveProperty("isAdmin");
    });
  });
});
