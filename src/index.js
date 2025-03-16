import dotenv from "dotenv";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import express from "express";
import connectDb from "./db/index.js";
const app = express();

dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

/*
(async () => {
  try {
    var connectInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`Connected to MongoDB: ${connectInstance.connection.host}`);
    app.on("error", (err) => {
      console.error(`error : ${err}`);
      throw err;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    process.exit(1);
  }
})();

*/
