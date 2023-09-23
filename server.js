const express = require("express");
const mongoose = require("mongoose");
const employeeRouter = require("./routes/employee");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = 5000;

//setup our server
app.listen(PORT, () => {
  console.log(`server is up and running in local host ${PORT}`);
});

//connecting to the mongodb atlas database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("Database connection is successful!"))
  .catch((err) => console.log(err));

//middlewars
app.use(cors());
app.use(express.json());
app.use("/api/employees", employeeRouter);
