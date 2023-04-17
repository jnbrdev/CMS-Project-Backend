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
const requestRouter = require("./routes/request");
const serviceRouter = require("./routes/service");
const invoiceRouter = require("./routes/invoice");
const rateRouter = require("./routes/rate");
const guestRouter = require("./routes/guest");
const billingsRouter = require("./routes/billings");

// Middleware
app.use("/users", userRouter);
app.use("/unit", unitRouter);
app.use("/login", loginRouter);
app.use("/req", requestRouter);
app.use("/service", serviceRouter);
app.use("/invoice", invoiceRouter);
app.use("/rate", rateRouter);
app.use("/guest", guestRouter);
app.use("/billings", billingsRouter);

db.sequelize.sync().then(() => {
  app.listen(3003, () => {
    console.log("server running on port 3003");
  });
});
