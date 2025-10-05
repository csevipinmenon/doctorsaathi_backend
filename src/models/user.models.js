import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    gender: String,
    location: String,
    Aadhar: String,
    age: String,
    pincode: String,
    role: {
      type: String,
      enum: ["doctor", "admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
