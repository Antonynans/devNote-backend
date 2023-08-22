import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.set(`strictQuery`, true);

  mongoose.connect(url);
  const db = mongoose.connection;
  db.on("error", (error) => {
    console.log("MongoDB connection error:", error);
  });
  db.once("open", () => {
    console.log("MongoDB connected");
  });
};

export default connectDB;
