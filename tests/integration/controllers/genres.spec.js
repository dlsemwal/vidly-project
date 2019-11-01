const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeAll(() => {
    server = require("../../../index");
  });

  afterAll(async () => {
    server.close();
    await Genre.deleteMany();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
      expect(res.body.some(g => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "new genre" });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/genres/5`);

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre was not found.", async () => {
      const res = await request(server).get(
        `/api/genres/${mongoose.Types.ObjectId().toHexString()}`
      );

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    const user = {
      email: "divyanshu.semwal@neosofttech.com",
      password: "123456"
    };
    let token;
    let name;
    const exec = () => {
      return request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User(user).generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters.", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is greater than 50 characters.", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save  if it is valid.", async () => {
      await exec();

      const genre = Genre.find({ name: "new genre" });
      expect(genre).not.toBeNull();
    });

    it("should return genre  if genre is valid.", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
