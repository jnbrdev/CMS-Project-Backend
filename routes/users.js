const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { Sequelize } = require('sequelize');
// Get All Users
router.get("/getAllUser", async (req, res) => {
  const listOfUsers = await Users.findAll();
  res.json(listOfUsers);
});

// Get Active User
router.get("/getActiveUser", async (req, res) => {
  let status = "Active";
  let getActiveUser = await Users.findAll({ where: { status: status } });
  res.json(getActiveUser);
});

//Get One User
router.get("/getOneUser/:id", async (req, res) => {
  let id = req.params.id;
  let getOneUser = await Users.findOne({ where: { id: id } });
  res.json(getOneUser);
});

// Add User
router.post("/addUser", async (req, res) => {
  const {
    email,
    password,
    full_name,
    contact_no,
    birthdate,
    role,
    status,
  } = req.body;
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

    // Fetch the last invoice number from the database
    const lastUser = await Users.findOne({
      order: [["createdAt", "DESC"]],
    });
    let lastInvoiceNumber = lastUser ? parseInt(lastUser.invoice_no.slice(3), 10) : 0;
    lastInvoiceNumber++; // Increment the invoice number
    const formattedInvoiceNumber = `INV${lastInvoiceNumber.toString().padStart(3, "0")}`;

//Save user
      const postUser = new Users({
        email,
        password: encryptedPassword,
        full_name,
        contact_no,
        birthdate,
        role,
        status,
        invoice_no: formattedInvoiceNumber,
      });
      
      await postUser.save();
      res.json({message: "Added Succesfully"});
      console.log(postUser);
     

    
    
  } catch (err) {console.log(err)}
});

//Login User

// Update User
router.put("/updateUser/:id", async (req, res) => {
  let id = req.params.id;
  const updateUser = await Users.update(req.body, { where: { id: id } });
  res.json(updateUser);
});

// Delete User
router.delete("/deleteUser/:id", async (req, res) => {
  let id = req.params.id;
  const delUser = await Users.destroy({ where: { id: id } });
  res.json(delUser);
});

module.exports = router;
