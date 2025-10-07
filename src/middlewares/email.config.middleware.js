import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // host: "smtp.ethereal.email",

  port: 587,
  secure: false,

  // service:"gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASS,
  },

  
});
