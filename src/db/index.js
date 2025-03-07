import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `MongoDB connected successfully to ${connectionInstance.connection.host}`
    );
  } catch (e) {
    console.log("Error connecting : ", e.message);
    process.exit(1);
  }
};

export default connectDb;
