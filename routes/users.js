const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
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
    unit_id,
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
      return res.json({ message: "User with email already exists! " });
    }

    const postUser = new Users({
      unit_id,
      email,
      password: encryptedPassword,
      full_name,
      contact_no,
      birthdate,
      role,
      status,
    });
    await postUser.save();
    res.json({message: "Added Succesfully"});
    console.log(postUser);
  } catch (err) {}
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
