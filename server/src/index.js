import connectDB from "./database/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const portName = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR!!", error);
      throw error;
    });
    app.listen(portName, () => {
      console.log(`Server is running at port ${portName}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB Connection failed!! ", error);
  });
