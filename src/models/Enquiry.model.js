import mongoose, { Schema } from "mongoose";

const enquiryschema = new Schema({
  email: {
    type: String,
    required: true,
    unique:true
    
  },
  message: {
    type: String,
    
  },
  name: String,
  phone: String,
  subject: String,
});

const Enquiry = mongoose.model("Enquiry", enquiryschema);

export default Enquiry;
