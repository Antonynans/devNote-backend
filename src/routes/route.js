import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import Login from "../model/login.js";
import FormModel from "../model/form.js";
import { sendMail } from "../services/mail.js";
import { generateOTP } from "../services/OTP.js";

const router = express.Router();

// auth register
router.post("/signUpUser", async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password is less than 8 characters" });
  }
  const isExisting = await Login.findOne({ email });
  if (isExisting) {
    return res.status(400).json({ message: "user already exists!! " });
  }

  const otpGenerated = generateOTP();
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await Login.create({
        username,
        fullname,
        email,
        password: hash,
        otp: otpGenerated,
      }).then(async (user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, email },
          process.env.JWT_SECRECT_KEY,
          { expiresIn: maxAge }
        );
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

        try {
          await sendMail({
            to: email,
            OTP: otpGenerated,
          });
          res.status(201).json({ message: "User successfully created", user });
        } catch (err) {
          console.log("unable to sign up");
        }
      });
    });
  } catch (err) {
    res.status(400).json({
      message: "User not successfully created, please try again later",
      error: err.message,
    });
  }
});

const validateUserSignUp = async (email, otp) => {
  const user = await Login.findOne({ email });
  if (!user) {
    return [false, "user not found"];
  }
  if (user && user.otp !== otp) {
    return [false, "Invalid OTP"];
  }
  const updatedUser = await Login.findByIdAndUpdate(user._id, {
    $set: { active: true },
  });
  return [true, updatedUser];
};

router.post("/verifyEmail", async (req, res) => {
  const { email, otp } = req.body;
  const user = await validateUserSignUp(email, otp);
  res.send(user);
});

// auth login
router.post("/loginUser", async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is provided
  if (!email || !password) {
    return res.status(400).json({ message: "email or password not provided " });
  }
  try {
    const user = await Login.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: "Login not successful", error: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRECT_KEY,
            { expiresIn: maxAge }
          );
          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(201).json({ message: "Login successful", user, token });
        } else {
          res.status(400).json({ message: "Invalid Credentials" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: "An error occurred", error: err.message });
  }
});

// get all data
router.get("/allUsers", async (req, res) => {
  try {
    const data = await Login.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get users by id
router.get("/getUsersById/:id", async (req, res) => {
  try {
    const data = await Login.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update users by id
router.patch("/update-users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const options = { new: true };

    console.log(updateData);
    const data = await Login.findByIdAndUpdate(id, updateData, options);
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete users by id
router.delete("/delete-users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Login.findByIdAndDelete(id);
    res.status(201).json({ message: "User successfully deleted" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "An error occurred",
      error: err.message,
    });
  }
});

// logout
router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});

// creating form
router.post("/create-form", async (req, res) => {
  const { title, description } = req.body;

  try {
    await FormModel.create({ title, description }).then((form) => {
      res.status(201).json({ message: "Form created successfully", form });
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Form not successful", error: err.message });
  }
});

// get form
router.get("/getForm", auth, async (req, res) => {
  try {
    const data = await FormModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// delete form by id
router.delete("/delete-form/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await FormModel.findByIdAndDelete(id);
    res.status(201).json({ message: "Form successfully deleted" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "An error occurred",
      error: err.message,
    });
  }
});

// update form by id
router.patch("/update-form/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const options = { new: true };

    const data = await FormModel.findByIdAndUpdate(id, updateData, options);
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
