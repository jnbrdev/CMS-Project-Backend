const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Add Unit
router.post("/loginUser", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const loginUserWithEmail = await Users.findOne({ where: { email } }).catch(
      (err) => {
        console.log("Error: ", err);
      }
    );

    if (!loginUserWithEmail)
      return res.json({ message: "Email or Password does not match!" });
    if (!(await bcrypt.compare(password, loginUserWithEmail.password))) {
      res.json({ message: "Wrong Password" });
    }
    const jwtToken = jwt.sign(
      {
        id: loginUserWithEmail.id,
        email: loginUserWithEmail.email,
        role: loginUserWithEmail.role,
        expiresIn: 300,
      },
      process.env.JWT_SECRET
    );
    res.json({
      message: "Login Successfully!",
      email: email,
      role: loginUserWithEmail.role,
      status: loginUserWithEmail.status,
      token: jwtToken,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
