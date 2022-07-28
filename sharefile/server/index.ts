const express = require("express");
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import fileRoute from "./routes/files";
import { v2 as cloudinary } from "cloudinary";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

app.use("/api/files", fileRoute);

app.listen(process.env.PORT, () => {
  console.log("Server started running");
});
