const express = require("express");
const {ToysModel,validateToys} = require("../models/toysModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

//http://localhost:3001/toys/category
//http://localhost:3001/toys/category?perPage=5
//http://localhost:3001/toys/category?perPage=5&name=puzzle
router.get('/:category?', async (req, res) => {
    const category = req.params.category;
    let perPage = req.query.perPage || 10;
    perPage = Math.min(perPage, 10);
    const { name, info } = req.query;
    const query = {};
    if (category) {
        query.category = category;
    }
    if (name) {
        query.name = { $regex: new RegExp(name), $options: 'i' };
    }
    if (info) {
        query.info = { $regex: new RegExp(info), $options: 'i' };
    }
    try{
        const data = await ToySchema.find({
            $or: [query]
        }).limit(perPage);
        res.json(data);
    }catch (err){
        res.status(502).json(err);
    }

});
//http://localhost:3001/toys/prices
//http://localhost:3001/toys/prices?min=10
//http://localhost:3001/toys/prices?max=100
//http://localhost:3001/toys/prices?min=10&max=100
//http://localhost:3001/toys/prices?min=10&max=100&skip=2
//http://localhost:3001/toys/prices?min=10&max=100&skip=2&perPage=5
router.get("/prices", async (req, res) => {
  const limit = 10;
  const skip = (req.query.skip - 1 || 0) * limit;
  const minPrice = req.query.min || 0; 
  const maxPrice = req.query.max || Infinity; 

  try {
    const data = await ToysModel
      .find({ price: { $gte: minPrice, $lte: maxPrice } })
      .limit(limit)
      .skip(skip);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
//http://localhost:3001/toys/count

router.get("/count", async (req, res) => {
  try {
    const data = await ToySchema.countDocuments();
    res.json(count);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.get('/single/:id', async (req, res) => {
  try {
    const toy = await ToySchema.findById(req.params.id);
    if (!toy) {
      return res.status(404).json({ message: "Toy not found" });
    }
    res.json(toy);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post('/',auth, async (req, res) => {
  const {error} = validateToys(req.body);
  if(error) return res.status(400).json(error.details[0].message);
  try{
     let newToy = await new ToySchema(req.body);
       newToy.user_id = req.tokenData._id;
      await newToy.save();
      res.status(200).json(newToy);
  }catch (err){
      res.status(502).json(err);
  }
})

uter.put('/:id',auth, async (req, res) => {
  const {error} = validateToys(req.body);
  if(error) return res.status(400).json(error.details[0].message);
  try{
      const data = await ToySchema.findOne({_id:req.params.id});
      console.log(data. user_id, req.tokenData._id)

      if(!data.user_id.equals(req.tokenData._id)) return res.status(401).json({msg:"You can't edit this toy"});
      const updated = await ToySchema.updateOne({_id:req.params.id},req.body);
      res.json(updated);
  }catch (err){
      res.status(502).json(err);
  }
})

router.delete('/:id',auth, async (req, res) => {
  try {
      const data = await ToySchema.findOne({_id: req.params.id});
      if (!data.user_id.equals(req.tokenData._id)) return res.status(401).json({msg: "You can't edit this toy"});
      const deleted = await ToySchema.deleteOne({_id: req.params.id});
      res.json(deleted);
  } catch (err) {
      res.status(502).json(err);
  }
})
// export default
module.exports = router;