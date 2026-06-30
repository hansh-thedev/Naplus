const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./.env" });

const app = require("./src/app");

mongoose
  .connect(process.env.MONGO_LOCAL)
  .then(() => {
    console.log("DB Connected Succesfully");
  })
  .catch(() => {
    console.log("ERROR! DB connection failed");
    process.exitCode = 1;
  });

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
