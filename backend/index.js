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
dotenv.config();
const jsonWebTokenSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
const webSocket = require("ws");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig.js");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

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
 *   get:
 *     summary: Get user profile.
 *     description: Retrieves the user profile based on the JWT token.
 *     responses:
 *       200:
 *         description: Successful request, returns user profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The unique user ID.
 *                 username:
 *                   type: string
 *                   description: The user's username.
 *       401:
 *         description: Unauthorized, JWT token is missing or invalid.
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
 *   post:
 *     summary: User login.
 *     description: Validates user login credentials and returns a JWT token.
 *     requestBody:
 *       description: User's login credentials.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Successful login, returns a JWT token and user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique user ID.
 *                 valid:
 *                   type: boolean
 *                   description: Indicates whether the login was successful.
 *       401:
 *         description: Login failed, invalid login credentials.
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

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout.
 *     description: Logs out the user by removing the JWT token.
 *     responses:
 *       200:
 *         description: Successful logout.
 *       401:
 *         description: Unauthorized, JWT token is missing or invalid.
 */
app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json();
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User registration.
 *     description: Registers a new user and returns a JWT token.
 *     requestBody:
 *       description: User's registration information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new user's username.
 *               password:
 *                 type: string
 *                 description: The new user's password.
 *     responses:
 *       201:
 *         description: Successful registration, returns a JWT token and user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique user ID of the new user.
 *                 username:
 *                   type: string
 *                   description: The username of the new user.
 *       409:
 *         description: Registration failed, username is already taken.
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

/**
 * @swagger
 * /messages/{userId}:
 *   get:
 *     summary: Get messages.
 *     description: Retrieves messages between the current user and another user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The user ID of the other user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful request, returns messages between users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sender:
 *                     type: string
 *                     description: The user ID of the message sender.
 *                   recipient:
 *                     type: string
 *                     description: The user ID of the message recipient.
 *                   text:
 *                     type: string
 *                     description: The message text.
 *                   sentAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time the message was sent.
 *       401:
 *         description: Unauthorized, JWT token is missing or invalid.
 */
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

if (require.main === module) {
  // Start the Express server on port 4040 and bind it to all available network interfaces
  const server = app.listen(4040, "0.0.0.0");

  // Create a WebSocket server that is bound to the Express server
  const webSocketServer = new webSocket.WebSocketServer({ server });

  // When a WebSocket connection is established
  webSocketServer.on("connection", (connection, req) => {
    // Check the cookies in the HTTP request header
    const cookies = req.headers.cookie;
    if (cookies) {
      // Find the token cookie within the cookies
      const tokenCookieString = cookies
        .split(";")
        .find((string) => string.startsWith("token="));
      if (tokenCookieString) {
        // Extract the token from the cookie
        const token = tokenCookieString.split("=")[1];
        if (token) {
          // Verify the token and obtain user data
          jsonWebToken.verify(
            token,
            jsonWebTokenSecret,
            {},
            (err, userData) => {
              if (err) throw err;
              const { userId, username } = userData;

              connection.userId = userId;
              connection.username = username;
            }
          );
        }
      }
    }

    // When message is received from a WebSocket client
    connection.on("message", async (message) => {
      const messageData = JSON.parse(message.toString());
      const { recipient, text, sentAt } = messageData;

      if (recipient && text) {
        // Create a message document in the database
        const messageDocument = await Message.create({
          sender: connection.userId,
          recipient,
          text,
          sentAt,
        });

        // Send the message to all WebSocket clients that are recipients
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

    // Send a list of users who are online to all WebSocket clients
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

  module.exports = { app, server };
} else {
  module.exports = app;
}
