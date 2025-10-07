import { asyncHandler } from "../utils/asyncHandler.js"
import { enquiryEmail } from "../middlewares/emailMsg.middleware.js";
import Enquiry from "../models/Enquiry.model.js"

 export const enquiry  = asyncHandler(async(req,res)=>{
  try {
    const { name, phone, email,subject, message } = req.body;
    if (!name || !phone || !email || !subject| !message) {
      return res
        .status(401)
        .json({ message: "All fields are reqired", success: false });
    }
    const user = await  Enquiry.findOne({email})
    if(user){
        user.subject = subject
        user.phone = phone
        user.message = message
        user.name = name
        await enquiryEmail(user.email,user.name)

        return res
      .status(200)
      .json({ message: "Enquiry submitting successfully" ,success:true});
    }
    
    const newUser = await Enquiry.create({
        email,
        name,
        message,
        subject,
        phone
    })
    await enquiryEmail(newUser.email,newUser.name)
    await newUser.save()
    return res
      .status(200)
      .json({ message: "Enquiry submitting successfully" ,success:true});

  } catch (error) {
    console.log("error in  sending enquiry ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }  
})