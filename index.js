const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotEnv = require("dotenv").config()
const bcrypt = require("bcryptjs")


app.use(express.json());
app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
const db = require("./models");

//Routers
const userRouter = require("./routes/users");
const unitRouter = require("./routes/unit");
const loginRouter = require("./routes/login");

// Middleware
app.use("/users", userRouter);
app.use("/unit", unitRouter);
app.use("/login", loginRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("server running on port 3001");
  });
});
