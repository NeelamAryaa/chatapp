const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cors = require("cors");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err));

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get("/test", (req, res) => {
  res.json("test ok !!!");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const createdUser = await User.create({ username, password });

    jwt.sign({ userId: createdUser._id }, jwtSecretKey, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).status(201).json({
        _id: createdUser._id,
      });
    });
  } catch (err) {
    if (err) throw err;
    // if (err) console.log(err);
    res.status(500).json("err");
  }
});

app.listen(4040);
