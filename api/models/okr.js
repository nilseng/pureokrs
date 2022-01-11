import mongoose from "mongoose";
const User = mongoose.model("User");

const okrSchema = new mongoose.Schema({
  objective: {
    type: String,
    required: true,
  },
  keyResults: [],
  parent: { type: mongoose.Schema.ObjectId, ref: "Okr" },
  children: [{ type: mongoose.Schema.ObjectId, ref: "Okr" }],
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },
  company: String,
});

mongoose.model("Okr", okrSchema);

export default {};
