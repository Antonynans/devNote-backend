import express from "express";
import * as dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import router from "./src/routes/route.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5174",
  })
);

app.use("/api", router);

async function connect() {
  try {
    app.listen(8000, () => {
      connectDB(process.env.MONGODB_PASSWORD);
      console.log("server is running on  port 8000");
    });
  } catch (err) {
    console.log(err);
  }
}
connect();


