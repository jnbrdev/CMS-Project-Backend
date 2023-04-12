const express = require("express");
const router = express.Router();
const { Users, Balance } = require("../models");
const bcrypt = require("bcryptjs");
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
// Get All Users
router.get("/getAllUser", async (req, res) => {
  const status = "Active";
  const excludedRoles = ["Super Admin", "Admin"];
  const getAllUser = await Users.findAll({
    where: {
      status: status,
      [Op.and]: [
        { role: { [Op.notIn]: excludedRoles } },
        { role: { [Op.ne]: null } }
      ]
    },
    attributes: { exclude: ['password'] }
  });
  res.json(getAllUser);
});

//Get Users
router.get('/getUnitOwnerDetails', async (req, res) => {
  const { search } = req.query;
  try {
    const users = await Users.findAll({
      where: {
        full_name: {
          [Op.like]: `%${search}%`,
        },
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

// Get Active User
router.get("/getActiveUser", async (req, res) => {
  const getActiveUser = await Users.findAll({
    where: {
      status: "Active",
      [Op.not]: [{ role: "Super Admin" }, { role: "Admin" }]
    },
  });
  res.json(getActiveUser);
});

//Get One User
router.get("/getOneUser/:id", async (req, res) => {
  let id = req.params.id;
  let getOneUser = await Users.findOne({ where: { id: id } });
  res.json(getOneUser);
});

// Add User
const roles = {
  1: "Super Admin",
  2: "Admin",
  3: "Accounting",
  4: "Unit Owner",
  5: "Tenant",
  6: "Security Guard",
  7: "Agent"
};

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

    let formattedInvoiceNumber = null;

    // Check if the role is "Unit Owner" or "Tenant"
    if (roles[role] === "Unit Owner" || roles[role] === "Tenant") {
      // Fetch the last invoice number from the database
      const lastUser = await Users.findOne({
        order: [["createdAt", "DESC"]],
      });
      let lastInvoiceNumber = 0;
      if (lastUser?.invoice_no) {
        lastInvoiceNumber = parseInt(lastUser.invoice_no.slice(3), 10);
      }
      lastInvoiceNumber++; // Increment the invoice number
      formattedInvoiceNumber = `INV${lastInvoiceNumber.toString().padStart(3, "0")}`;

      
    }

    // Map the role number to the corresponding name
    const roleName = roles[role];

    // Save user with the role name instead of the role number
    const postUser = new Users({
      email,
      password: encryptedPassword,
      full_name,
      contact_no,
      birthdate,
      role: roleName, // Use the mapped role name instead of the role number
      status,
      invoice_no: formattedInvoiceNumber,
    });

    await postUser.save();
    res.json({message: "Added Successfully"});
    console.log(postUser);

  } catch (err) {
    console.log(err)
  }
});

//Login User

// Update User
router.put("/updateUser/:email", async (req, res) => {
  try {
    const emails = req.params.email;
    const getOneUser = await Users.findOne({ where: { email: emails } });
    const userID = getOneUser.id
    const updateUser = await Users.update(req.body, { where: { id: userID } });
    res.json(updateUser);
    console.log(req.body, emails)
  } catch (error) {
    console.log(error)
  }
});

// Delete User
router.delete("/deleteUser/:email", async (req, res) => {
  let email = req.params.email;
  const delUser = await Users.destroy({ where: { email: email } });
  res.json(delUser);
});

module.exports = router;
