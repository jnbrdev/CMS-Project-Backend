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

    //const roles = Object.values(loginUserWithEmail.role);
    const roles = loginUserWithEmail.role;
    res.cookie("jwt", refToken, {
      httpOnly: false,
      sameSite: "None",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login Successfully!",
      email: email,
      role: roles,
      full_name: loginUserWithEmail.full_name,
      status: loginUserWithEmail.status,
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/refreshToken", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await Users.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = jwt.sign(
      {
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        expiresIn: "1h",
      },
      process.env.JWT_SECRET
    );

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

module.exports = router;
