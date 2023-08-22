import mongoose from "mongoose";

const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const form_model = mongoose.model("Forms", FormSchema);

export default form_model;
