const express = require("express");
const router = express.Router();
const { Rate } = require("../models");
const { Users } = require("../models");

// Get All Rate
router.post("/getAllRate", async (req, res) => {
  const listOfRate = await Rate.findAll();
  res.json(listOfRate);
});

// UPDATE RATE
router.put("/updateRate/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const updateRate = await Rate.update(req.body, { where: { id: id } });
        res.json(updateRate);
    
    } catch (error) {
      res.json(error)
    }
});

module.exports = router;
