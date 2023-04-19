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

// Update Service
router.put("/updateService/:serviceName", async (req, res) => {
  try {
    const servicesName = req.params.serviceName;
    const updatedService = await Service.update(req.body, { where: { service_name: servicesName } });
    res.json(updatedService);
    console.log(req.body.rate)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Delete
router.delete("/delService/:serviceName", async (req, res) => {
  const servName = req.params.serviceName;
  const delService = await Service.destroy({ where: { service_name: servName } });
  if (delService) {
    res.json({ message: `Service ${servName} was deleted successfully.` });
  } else {
    res.status(404).json({ message: `Service ${servName} not found.` });
  }
});



module.exports = router;
