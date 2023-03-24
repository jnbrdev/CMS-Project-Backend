const express = require("express");
const router = express.Router();
const { SecurityShift } = require("../models");
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
// Get All Security
router.post("/getAllSecurity", async (req, res) => {
  const roleSecurity = "6";
  const listOfSecurity = await SecurityShift.findAll({
    include: {
      model: Users,
      where: { role: roleSecurity },
    },
  });
  res.json(listOfSecurity);
});

// Add Security
router.post("/addSecurity", async (req, res) => {
  const { email, password, full_name, contact_no, birthdate, tower_no } = req.body;
  const roleSecurity = "6";
  const statusSecurity = "Active"
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const alreadyExistUser = await Users.findOne({ where: { email } }).catch(
      (err) => {
        console.log(err);
      }
    );
    if (alreadyExistUser) {
      return res.json({ message: "User with this email already exists! " });
    }

    //Save user
    const postUser = new Users({
      email,
      password: encryptedPassword,
      full_name,
      contact_no,
      birthdate,
      role: roleSecurity,
      status: statusSecurity,
    });
    await postUser.save();
    // Add Security Shift and Number
    const lastSecurity = await SecurityShift.findOne({
        order: [["createdAt", "DESC"]],
    });
    let lastSecurityNumber = lastSecurity ? parseInt(lastSecurity.security_no.slice(3), 10) : 0;
    lastSecurityNumber++; // Increment the invoice number
    const formattedSecurityNumber = `SEC${lastSecurityNumber.toString().padStart(3, "0")}`;
    const uID = await Users.findOne({ where: { email: email } })
    const userId = uID.id
    const postSecurityShift = new SecurityShift({
        UserId: userId,
        security_no: formattedSecurityNumber,
        tower_no,
      });
      await postSecurityShift.save();
    res.json({ message: "Added Succesfully" });
    console.log(postUser);
  } catch (err) {
    console.log(err);
  }
});

// Update Unit
router.put("/updateUnit/:unitNo", async (req, res) => {
  try {
    const unit_no = req.params.unitNo;
    const updateUnit = await Unit.update(req.body, {
      where: { unit_no: unit_no },
    });
    res.json(updateUnit);
  } catch (error) {
    res.json(error);
  }
});

// Delete Unit
router.delete("/deleteUnit/:id", async (req, res) => {
  let id = req.params.id;
  const delUnit = await Unit.destroy({ where: { id: id } });
  res.json(delUnit);
});

module.exports = router;
