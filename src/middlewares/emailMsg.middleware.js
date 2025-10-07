import { transporter } from "./email.config.middleware.js";
import { Verification_Email_Template } from "./emailTemplates.middleware.js";
import { Enquiry_Email_Template } from "./emailTemplates.middleware.js";

export const sendVerificationCode = async (email, verificationCode, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"DoctorSaathi" <vipinmemon7050@gmail.com>',
      to: email,
      subject:
        "Welcome to DoctorSaathi : India largest home telemedicine provider",
      text: "verify your email",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ).replace("{name}", name),
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log(error);
  }
};

export const enquiryEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"DoctorSaathi" <vipinmemon7050@gmail.com>',
      to: email,
      subject: "Welcome to DoctorSaathi : India largest home telemedicine service provider",
      text: "Welcome to DoctorSaathi",
      html: Enquiry_Email_Template.replace("{name}", name),
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log(error);
  }
};
