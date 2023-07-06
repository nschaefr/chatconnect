const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jsonWebToken = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/user");

dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const jsonWebTokenSecret = process.env.JWT_SECRET;

const app = express();

console.log(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("tesst ok");
});

app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const createdUser = await User.create({ email, username, password });
  jsonWebToken.sign(
    { userId: createdUser, id },
    jsonWebTokenSecret,
    (err, token) => {
      if (err) throw err;
      res.cookie("token", token).status(201).json("ok");
    }
  );
});

app.listen(4000);
