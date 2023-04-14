const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Login API
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
    const accessToken = jwt.sign(
      {
        id: loginUserWithEmail.id,
        email: loginUserWithEmail.email,
        role: loginUserWithEmail.role,
        expiresIn: "1h",
      },
      process.env.JWT_SECRET
    );
    //
    const refToken = jwt.sign(
      {
        email: loginUserWithEmail.email,
        expiresIn: "1d",
      },
      process.env.JWT_SECRET_REFRESH
    );

    const roles = Object.values(loginUserWithEmail.role);
    res.cookie("jwt", refToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login Successfully!",
      email: email,
      role: roles,
      status: loginUserWithEmail.status,
      accessToken: accessToken,
      refreshToken: refToken,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
