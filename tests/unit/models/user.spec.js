const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("user.generateAuthToken", () => {
  it("should return valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

describe("user.sendVerificationMail", () => {
  it("should call user.sendVerificationMail", () => {
    const user = new User({ email: "divyanshu.semwal@neosofttech.com" });
    const code = "code";

    user.sendVerificationMail(code);
  });
});
