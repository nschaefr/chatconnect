const express = require("express");
const app = express();
const mongoose = require("mongoose").default;
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Message = require("./models/message");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Chat-API",
      description: "Userinformation for chatting",
      contact: {
        name: "Nils Schäfer",
      },
      servers: ["http://localhost:4040"],
    },
  },
  apis: ["index.js"],
};
dotenv.config();
const swaggerDocs = swaggerJsDoc(swaggerOptions);
const jsonWebTokenSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
const webSocket = require("ws");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose.connect(process.env.MONGO_URL);

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jsonWebToken.verify(token, jsonWebTokenSecret, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

// Routes

/**
 * @swagger
 * /profile:
 *  get:
 *    tags:
 *      - Profile
 *    description: Get user profile data using a token from cookies.
 *    responses:
 *      200:
 *        description: Successful response
 */
app.get("/profile", async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jsonWebToken.verify(token, jsonWebTokenSecret, {}, (err, userData) => {
      if (err) throw err;
      res.status(200).json(userData);
    });
  }
});

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *      - Authentication
 *    description: Authenticate a user and generate a JWT token upon successful login.
 *    parameters:
 *      - name: body
 *        description: User credentials.
 *        in: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: Successful login
 */
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
          if (err) {
            throw err;
          } else {
            res
              .cookie("token", token, { sameSite: "none", secure: true })
              .status(200)
              .json({
                id: foundUser._id,
                valid: true,
              });
          }
        }
      );
    } else {
      res.json({ valid: false });
    }
  } else {
    res.json({ valid: false });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json();
});

/**
 * @swagger
 * /signup:
 *  post:
 *    tags:
 *      - Authentication
 *    description: Create a new user and generate a JWT token upon successful signup.
 *    parameters:
 *      - name: body
 *        description: User credentials.
 *        in: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      201:
 *        description: Successful signup
 */
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
      }
    );
  } catch (err) {
    res.json({
      duplicate: true,
    });
  }
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

const server = app.listen(4040, "0.0.0.0");
const webSocketServer = new webSocket.WebSocketServer({ server });

webSocketServer.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((string) => string.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jsonWebToken.verify(token, jsonWebTokenSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, sentAt } = messageData;
    if (recipient && text) {
      const messageDocument = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        sentAt,
      });
      [...webSocketServer.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              sender: connection.userId,

              recipient,
              _id: messageDocument._id,

              sentAt,
            })
          )
        );
    }
  });

  [...webSocketServer.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...webSocketServer.clients].map((client) => ({
          userId: client.userId,
          username: client.username,
        })),
      })
    );
  });
});
