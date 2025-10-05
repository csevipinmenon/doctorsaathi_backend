import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // host: "smtp.ethereal.email",

  port: 587,
  secure: false,

  // service:"gmail",
  auth: {
    user: "vipinmemon7050@gmail.com",
    pass: "dual euld vmzx mexg",
  },

  
});
