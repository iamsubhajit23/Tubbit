import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();

const databaseURI = process.env.DATABASE_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(`${databaseURI}/${DB_NAME}`);
    console.log(`MONGODB Connected !!`);
  } catch (error) {
    console.error("MONGODB Connection failed ", error);
    process.exit(1);
  }
};

export default connectDB;
