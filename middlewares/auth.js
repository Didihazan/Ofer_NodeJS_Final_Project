const jwt = require("jsonwebtoken");


exports.auth = (req,res,next) => {
  const token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({err:"You need to send token 1111"});
  }
  try{
    const decodeToken = jwt.verify(token,"mySecretKey");
    req.tokenData = decodeToken

    next()
  }
  catch(err){
    return res.status(401).json({err:"Token invalid or expired 2222"});
  }
}