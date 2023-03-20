const express = require("express");
const router = express.Router();
const { Service } = require("../models");
const { Users } = require("../models");

// Get All Service
router.post("/getAllService", async (req, res) => {
  const listOfService = await Service.findAll();
  res.json(listOfService);
});

// Add Service
router.post("/addService", async (req, res) => {
  const { service_name, rate, status } = req.body;
  try {
    const postService = new Service({
      service_name,
      rate,
      status,
    });
    await postService.save();
    res.json({ message: "Service Added Succesfully" });
    console.log(postService);
  } catch (err) {console.log(err)}
});

module.exports = router;
