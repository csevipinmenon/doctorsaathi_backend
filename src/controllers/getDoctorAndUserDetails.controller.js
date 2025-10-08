import Doctor from "../models/doctor.models.js";
import User from "../models/user.models.js";

export const getDoctorAndUserDetails = async (req, res) => {
  try {
    const { doctorId, userId } = req.params;

    
    const doctor = await Doctor.findById(doctorId).select(
      "name specialist email phone photo experience degree"
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

 
    const user = await User.findById(userId).select(
      "name email phone gender age"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    res.json({
      message: "Doctor and User details fetched successfully",
      doctor,
      user,
    });
  } catch (error) {
    console.error("Error fetching doctor/user details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
