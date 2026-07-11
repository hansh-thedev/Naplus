const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exceptions: Gracefully closing server");
  process.exit(1);
});

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
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Handling asynchronous errors/rejections
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection: Gracefully closing server");
  server.close(() => {
    process.exit(1);
  });
});
