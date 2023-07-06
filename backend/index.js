const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const jsonWebToken = require("jsonwebtoken");
const User = require("./models/user");

dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const jsonWebTokenSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const createdUser = await User.create({ email, username, password });
    jsonWebToken.sign(
      { userId: createdUser._id },
      jsonWebTokenSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).status(201).json({
          id: createdUser._id,
        });
      }
    );
  } catch (err) {
    if (err) throw err;
  }
});

app.listen(4040, "localhost");
