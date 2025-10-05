import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    gender: String,
    hospital: String,
    age: String,
    pincode: String,
    experience: String,
    degree: String,
    photo: String,
    specialist: String,
    role: {
      type: String,
      enum: ["doctor", "admin", "user"],
      default: "doctor",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
