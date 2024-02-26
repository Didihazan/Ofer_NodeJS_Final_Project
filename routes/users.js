const express = require("express");
const bcrypt = require("bcrypt");
const {auth} = require("../middlewares/auth")
const {UserModel,validateUser,validateLogin,createToken} = require("../models/userModel");

const router = express.Router();

router.get("/",(req,res) => {
  res.json({msg:"users endpoint"})
})


router.get("/userInfo", auth ,async(req,res) => {

  try{
    const user = await UserModel.findOne({_id:req.tokenData._id},{password:0})
    res.json(user);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
  
})

router.post("/",async(req,res) => {
  const validBody = validateUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "******";
    res.status(201).json(user);
  }
  catch(err){
    if(err.code == 11000){
      return res.status(400).json({msg:"Email already in system",code:11000})
    }
    console.log(err);
    res.status(502).json({err})
  }
})
//http://localhost:3001/users/login
router.post("/login",async(req,res) => {
  const validBody = validateLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const user = await UserModel.findOne({email:req.body.email})
    if(!user){
      return res.status(401).json({err:"Email not in system"});
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass){
      return res.status(401).json({err:"password not match"});
    }
    const token = createToken(user._id)
    res.json({token})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


module.exports = router;