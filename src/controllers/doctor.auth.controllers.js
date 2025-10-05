import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.models.js";
import dotenv from "dotenv";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

dotenv.config();




export const signup = async (req, res) => {
  let photo;
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Missing body data" });
    }

    const {
      name,
      email,
      phone,
      password,
      gender,
      hospital,
      age,
      pincode,
      experience,
      degree,
      specialist,
    } = req.body;

    
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, phone, and password are required" });
    }

    
    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    
    const photoLocalPath = req.file?.path;
    if (!photoLocalPath) {
      return res.status(400).json({ message: "Photo Missing" });
    }

    try {
      photo = await uploadOnCloudinary(photoLocalPath);
    } catch (error) {
      console.log("error uploading avatar", error);
      return res
        .status(400)
        .json({ message: "Error Uploading Photo on Cloudinary" });
    }

   
    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Password is required and must be a string" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await Doctor.create({
      name,
      photo: photo.url,
      email,
      phone,
      password: hashed,
      gender,
      experience,
      pincode,
      age,
      specialist,
      degree,
      hospital,
    });

    res.status(201).json({
      message: "Doctor registered successfully",
      success: true,
      doctorId: newUser._id,
    });
  } catch (err) {
    console.log("Signup error:", err.message);

    if (photo?.public_id) {
      await deleteFromCloudinary(photo.public_id);
    }

    res.status(500).json({ message: err.message, success: false });
  }
};

// Generate tokens
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Doctor.findOne({ email });
    if (!user) return res.status(404).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

      path: "/",
    });
    // console.log("refresh", req.cookie);

    return res.json({ token: accessToken, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({ token: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const doctorProfile = async (req, res) => {
  const doctor = await Doctor.findById(req.user.id).select("-password");

  res.json({ doctor });
};
