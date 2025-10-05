import { Consult } from "../models/consult.model.js";

export const getPendingConsults = async (req, res) => {
  try {
    const pendingConsults = await Consult.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    if (!pendingConsults || pendingConsults.length === 0) {
      return res
        .status(404)
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
