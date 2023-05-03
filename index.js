const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotEnv = require("dotenv").config()
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser");


const allowedOrigins = [
  'http://localhost:3002',
  'http://localhost:3000',
  'http://localhost',  
  'http://52.63.84.156', 
  'http://52.63.84.156:3002', 
  'http://52.63.84.156:3002/api'
];
app.use(cors({
  origin: allowedOrigins
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.json());
app.use(cookieParser());
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
app.use("/api/users", userRouter);
app.use("/api/unit", unitRouter);
app.use("/api/login", loginRouter);
app.use("/api/req", requestRouter);
app.use("/api/service", serviceRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/rate", rateRouter);
app.use("/api/guest", guestRouter);
app.use("/api/billings", billingsRouter);

db.sequelize.sync().then(() => {
  app.listen(3002, () => {
    console.log("server running on port 3002");
  });
});
