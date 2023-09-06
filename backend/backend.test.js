const request = require("supertest");
const app = require("./index");
const mongoose = require("mongoose");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

describe("authentication endpoints", () => {
  const secretKey = process.env.JWT_SECRET;
  const validToken1 = jwt.sign(
    { username: "testuser", id: "testuserid" },
    secretKey
  );

  it("should get user profile information with a valid token", async () => {
    const response = await request(app)
      .get("/profile")
      .set("Cookie", `token=${validToken1}`);

    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).toHaveProperty("id", "testuserid");
  });

  it("should sign up a new user", async () => {
    await User.deleteOne({ username: "testuser" });
    const response = await request(app)
      .post("/signup")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username", "testuser");
  });

  it("should handle duplicate username during sign up", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.body).toHaveProperty("duplicate", true);
  });

  it("should log in an existing user", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("valid", true);
  });

  it("should log the user out and clear the token cookie", async () => {
    const response = await request(app).post("/logout");

    expect(response.body).toEqual("");
  });

  it("should handle invalid login credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "invaliduser", password: "invalidpassword" });

    expect(response.body).toHaveProperty("valid", false);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
