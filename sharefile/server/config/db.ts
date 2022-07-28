import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!).then(() => {
      console.log("DB Connected");
    });
  } catch (error) {
    console.log("Connection failed");
    process.exit(1);
  }
};

export default connectDB;
