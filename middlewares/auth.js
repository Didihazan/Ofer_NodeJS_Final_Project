const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.auth = (req,res,next) => {
  const token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({err:"You need to send token 1111"});
  }
  try{
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET);
    req.tokenData = decodeToken

    next()
  }
  catch(err){
    return res.status(401).json({err:"Token invalid or expired 2222"});
  }
}
