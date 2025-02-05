const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const user_route = require("./routes/userRoute");

app.use(cors());

app.use(express.json());
app.use((req, res, next) => {
  console.log("HTTP method = " + req.method + " , URL - " + req.url);
  next();
});

app.use("/api/user", user_route);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => app.listen(5000))
  .then(() =>
    console.log(`MongoDB connected Succesfully to Port ${process.env.PORT}`)
  )
  .catch((err) => console.log(err));
