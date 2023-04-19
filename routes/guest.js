const express = require("express");
const router = express.Router();
const { Guest } = require("../models");
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
// Get All Guest
router.post("/getAllGuest", async (req, res) => {
  
  const listOfGuest = await Guest.findAll({});
  res.json(listOfGuest);
});

//Add Guest
router.post("/addGuest", async (req, res) => {
    const { guest_no, unit_no, full_name, contact_no, date_from, date_to } = req.body;
    const statusGuest = "Active"
    
    try {
      // Add Security Shift and Number
      const lastGuest = await Guest.findOne({
          order: [["createdAt", "DESC"]],
      });
      let lastGuestNumber = lastGuest ? parseInt(lastGuest.guest_no.slice(5), 10) : 0;
      lastGuestNumber++; // Increment the invoice number
      const formattedGuestNumber = `GUEST${lastGuestNumber.toString().padStart(3, "0")}`;
      const postGuestShift = new Guest({
          guest_no: formattedGuestNumber,
          unit_no,
          full_name,
          contact_no,
          date_from,
          date_to,
          status: statusGuest,
        });
        await postGuestShift.save();
      res.json({ message: "Added Succesfully" });
      console.log(postGuestShift);
    } catch (err) {
      console.log(err);
    }
  });

  //Delete Guest
  router.delete("/delGuest/:guestNum", async (req, res) => {
    const gNum = req.params.guestNum;
    const delGuests = await Guest.destroy({ where: { guest_no: gNum } });
    if (delGuests) {
      res.json({ message: `Guest ${gNum} was deleted successfully.` });
    } else {
      res.status(404).json({ message: `Guest ${gNum} not found.` });
    }
  });
module.exports = router;
