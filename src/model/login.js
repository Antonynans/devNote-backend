import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    username: { type: String, required: false },
    picture: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String, minlength: 8, required: true },
    otp: { type: String, required: true },
  },
  { timestamps: true }
);

const Login = mongoose.model("login", LoginSchema);

export default Login;
