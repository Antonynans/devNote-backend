import express from "express";
import auth from "../middleware/auth.js";
import Login from "../model/login.js";
import FormModel from "../model/form.js";

const form = express.Router();

// creating form
form.post("/create-form", async (req, res) => {
  try {
    // Extract form data from the request body
    const { title, description, userId } = req.body;

    // Check if the user exists
    const user = await Login.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new form
    const newForm = new FormModel({
      title,
      description,
      user: userId, // Associate the form with the user by their ID
    });

    // Save the form to the database
    await newForm.save();

    res.status(201).json({ message: "Form created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// get form
form.get("/getForm", auth, async (req, res) => {
  try {
    const data = await FormModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get form by id
form.get("/getFormById/:id", auth, async (req, res) => {
  try {
    const data = await FormModel.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// delete form by id
form.delete("/delete-form/:id", async (req, res) => {
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
form.patch("/update-form/:id", async (req, res) => {
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

form.get("/forms/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await Login.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const forms = await FormModel.find({ user: { $in: user } });
    return res.json(forms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default form;
