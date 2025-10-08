import { Consult } from "../models/consult.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPendingConsults = async (req, res) => {
  try {
    const pendingConsults = await Consult.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    if (!pendingConsults || pendingConsults.length === 0) {
      return res
        .status(201)
        .json({ message: "No pending consultations found" });
    }

    res.status(200).json({
      success: true,
      count: pendingConsults.length,
      consultations: pendingConsults,
    });
  } catch (error) {
    console.error("Error fetching pending consultations:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch pending consultations.",
    });
  }
};



export const getDoctorApprovedConsults = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.user.id; // doctor ID from JWT or session

    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Doctor ID not found.",
      });
    }

    // Fetch all approved consults for the logged-in doctor
    const approvedConsults = await Consult.find({
      doctor: doctorId,
      status: "approved",
    })
      .populate("doctor", "name specialization email")
      .sort({ createdAt: -1 });

    if (!approvedConsults || approvedConsults.length === 0) {
      return res.status(201).json({
        success: true,
        message: "No approved consults found for this doctor.",
      });
    }

    return res.status(200).json({
      success: true,
      count: approvedConsults.length,
      data: approvedConsults,
    });
  } catch (error) {
    console.error("Error fetching doctor approved consults:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching consults.",
    });
  }
});


