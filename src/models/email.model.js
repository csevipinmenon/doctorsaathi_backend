import mongoose, { Schema } from "mongoose";

const emailschema = new Schema({
  email: {
    type: String,
    required: true,
    unique:true
    
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  name: String,
  verificationCode: String,
  password: String,
});

const Email = mongoose.model("Email", emailschema);

export default Email;
