import { Consult } from "../models/consult.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js"

export const getAllConsults = async (req, res) => {
  try {
    const consults = await Consult.find().sort({
      createdAt: -1,
    });

    if (!consults || consults.length === 0) {
      return res
        .status(201)
        .json({ message: "No consultations found" });
    }

    res.status(200).json({
      success: true,
      count: consults.length,
      consultations: consults,
    });
  } catch (error) {
    console.error("Error fetching all consultations:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch all consultations.",
    });
  }
};





export const getDoctorApprovedConsults = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.user.id;

    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Doctor ID not found.",
      });
    }

    const approvedConsults = await Consult.find({
      doctor: doctorId,
      status: "approved",
    }).sort({ createdAt: -1 });

    if (!approvedConsults.length) {
      return res.status(200).json({
        success: true,
        message: "No approved consults found for this doctor.",
        data: [],
      });
    }

    // Fetch user details for each consult
    const consultsWithUser = await Promise.all(
      approvedConsults.map(async (consult) => {
        const user = await User.findOne(
          { email: consult.userEmail },
          "_id name email"
        ); 

        return {
          ...consult.toObject(),
          userDetails: user || null, // attach user info
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: consultsWithUser.length,
      data: consultsWithUser,
    });
  } catch (error) {
    console.error("Error fetching doctor approved consults:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching consults.",
    });
  }
});


