const mongoose = require("mongoose");
const Joi = require("joi");

const ToysSchema = new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    img_url:String,
    price:Number,
    date_created:Date,
    user_id:String
  },{timestamps:true})
  
  
  exports.ToysModel = mongoose.model("toys",ToysSchema);
  
  exports.validateToys = (_reqBody) => {
    const joiSchema = Joi.object({
      name:Joi.string().min(3).max(50).required(),
      info:Joi.string().min(3).max(1000).required(),
      category:Joi.string().min(3).max(100).required(),
      img_url:Joi.string().min(3).max(100).optional(),
      price:Joi.number().min(4).max(20000).required()
    })
    return joiSchema.validate(_reqBody)
  }
