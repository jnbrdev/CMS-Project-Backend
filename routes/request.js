const express = require("express");
const router = express.Router();
const { Request } = require("../models");
const { Users } = require("../models");

// Get All Request
router.post("/getAllRequest", async (req, res) => {
  const listOfRequest = await Request.findAll();
  res.json(listOfRequest);
});




module.exports = router;
