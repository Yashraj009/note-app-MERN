const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticator } = require("../middlewares/authenticator");
const noteRouter = express.Router();

noteRouter.use(authenticator)

noteRouter.get("/",(req,res)=>{
    res.send({
        message:"All the notes",
        status:1,
    })
})

module.exports = {
    noteRouter,
}
