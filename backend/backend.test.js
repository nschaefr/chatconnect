const request = require("supertest");
const app = require("./index");
const mongoose = require("mongoose");
const User = require("./models/user");

describe("authentication endpoints", () => {
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
