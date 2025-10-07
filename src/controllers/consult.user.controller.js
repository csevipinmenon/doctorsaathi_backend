import {Consult} from "../models/consult.model.js";
import Doctor from "../models/doctor.models.js"

const consultBook = async (req, res) => {
  try {
    const { name, email, phone, age, gender, symptoms, specialist } = req.body;

    const consult = await Consult.create({
      userEmail: email,
      name,
      age,
      gender,
      phone,
      symptoms,
      specialist,
    });

    res.status(200).json({ message: "consult book successFully", consult });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserConsults = async (req, res) => {
  try {
    const { email } = req.params;

    
    const consults = await Consult.find({ userEmail: email })
      .sort({ createdAt: -1 })
      .populate("doctor"); 

    
    res.status(200).json({ consults });
  } catch (error) {
    console.error("Error in getUserConsults:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const cancelConsult = async (req, res) => {
  try {
    const { id } = req.params;
    await Consult.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Consult cancelled successfully", success: true });
  } catch (error) {
    res.status(500).json({ errror: "Internal Server Error" });
  }
};

export { consultBook, getUserConsults, cancelConsult };
