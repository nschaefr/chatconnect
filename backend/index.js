const express = require("express");
const mongoose = require("mongoose").default;
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const jsonWebTokenSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);

app.get("/profile", async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jsonWebToken.verify(token, jsonWebTokenSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const valid = bcrypt.compareSync(password, foundUser.password);
    if (valid) {
      jsonWebToken.sign(
        { userId: foundUser._id, username },
        jsonWebTokenSecret,
        {},
        (err, token) => {
          res.cookie("token", token).json({
            id: foundUser._id,
            valid: true,
          });
        },
      );
    } else {
      res.json({ valid: false });
    }
  } else {
    res.json({ valid: false });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jsonWebToken.sign(
      { userId: createdUser._id, username },
      jsonWebTokenSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id,
            username,
          });
      },
    );
  } catch (err) {
    res.json({
      duplicate: true,
    });
  }
});

app.listen(4040, "localhost");
