import mongoose from "mongoose";

const aashaSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    gender: String,
    location: String,
    Aadhar: String,
    age: String,
    pincode: String,
    role: {
      type: String,
      enum: ["doctor", "aasha", "user"],
      default: "aasha",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Aasha", aashaSchema);
