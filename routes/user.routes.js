const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/UserModel");
const { noteModel } = require("../models/NoteModel");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("All users");
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 5, async function (err, hash) {
    // Store hash in your password DB.
    if (err) return res.send({ message: "Something went sideways", status: 0 });
    try {
      let user = new userModel({ name, email, password: hash });
      await user.save();
      res.send({
        message: "User created",
        status: 1,
      });
    } catch (err) {
      res.send({
        message: err.message,
        status: 0,
      });
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let option={
    expiresIn:"3m"//expires our jwt token in 3 mins
  }

  try {
    let data = await userModel.find({ email });
    let token = jwt.sign({ userId:data[0]._id }, "ash",option);
    if (email.length > 0) {
      bcrypt.compare(password, data[0].password, function (err, result) {
        if (err)
          return res.send({
            message: "Something seems incorrect" + err,
            status: 0,
          });

        if (result) {
          res.send({
            message: "You are logged in successfully",
            token: token,
            status: 1,
          });
        } else {
          res.send({
            message: "Incorrect password",
            status: 0,
          });
        }
      });
    } else
      [
        res.send({
          message: "User does not exist",
          status: 0,
        }),
      ];
  } catch (error) {
    res.send({
      message: error.message,
      status: 0,
    });
  }
});

module.exports = { userRouter };
