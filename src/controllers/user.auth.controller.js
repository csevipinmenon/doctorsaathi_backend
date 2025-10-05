import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
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
      age,
      location,
      Aadhar,
      pincode,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashed,
      gender,
      location,
      Aadhar,
      age,
      pincode,
    });
    res.status(201).json({ message: "User registered", success: true });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message, success: false });
  }
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

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

export const userProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json({ user });
};
