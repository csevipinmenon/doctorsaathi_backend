import { asyncHandler } from "../utils/asyncHandler.js";
import Doctor from "../models/doctor.models.js";
import bcrypt from "bcrypt";
import {
  sendVerificationCode,
  
} from "../middlewares/emailMsg.middleware.js";
import Email from "../models/email.model.js";
import  {Password_Change_Success_Template} from "../middlewares/emailTemplates.middleware.js"

const forgetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || password) {
      return res
        .status(401)
        .json({ message: "All fields are reqired", success: false });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found!" });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await Email.create({
      name: doctor.name,
      email,
      verificationCode,
      password: hashed,
    });

    await newUser.save({ validateBeforeSave: false });
    await sendVerificationCode(newUser.email, verificationCode, newUser.name);
    return res
      .status(200)
      .json({ message: "verifiction code send on your email", success: true });
  } catch (error) {
    console.log("error in enquiry controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res
        .status(501)
        .json({ message: "verification code is emtpy", success: false });
    }

    const user = await Email.findOne({ verificationCode: otp });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }
    const email = user.email;
    const doctor = await Doctor.findOne({ email });
    doctor.password = user.password;
    user.isVerified = true;
    user.verificationCode = undefined;

    await doctor.save();
    await user.save();
    await Password_Change_Success_Template(user.email, user.name);

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export { forgetPassword, verifyEmail };
