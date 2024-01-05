const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose'); // Import Mongoose

const jwt = require("jsonwebtoken");
const { authenticator } = require("../middlewares/authenticator");
const { noteModel } = require("../models/NoteModel");
const noteRouter = express.Router();

noteRouter.use(authenticator)

noteRouter.get("/",(req,res)=>{

    let token = req.headers.authorization
    jwt.verify(token,"ash", async (error, decode)=>{
        
        try {
            let data = await noteModel.find({user: decode.userId})
            // console.log(data);
            res.send({
                data:data,
                message:"All notes are successfully loaded",
                status:1
            })
        } catch (error) {
            res.send({
              message: error.message ,
              status: 0,
            });
        }
    })
    // res.send({
    //     message:"All the notes",
    //     status:1,
    // })
})

noteRouter.post("/create", async (req, res) => {
    
    try {
        let note = new noteModel(req.body)
        await note.save()
        res.send({
            message: "Note Created",
            status:1
        })
    } catch (error) {
        res.send({
            message: error.message,
            status:0
        })
    }
});

noteRouter.patch("/",async(req,res)=>{
    let {id} = req.headers
    try {
        await noteModel.findByIdAndUpdate({_id:id},req.body)
        res.send({
            message:"Note Updated",
            status:1
        })
    } catch (error) {
        res.send({
            message:error.message,
            status:0
        })
    }
})

noteRouter.delete("/", async (req, res) => {
  let { id } = req.headers;
  try {
    await noteModel.findByIdAndDelete({ _id: id });
    res.send({
      message: "Note Deleted",
      status: 1,
    });
  } catch (error) {
    res.send({
      message: error.message,
      status: 0,
    });
  }
});

module.exports = {
    noteRouter,
}
