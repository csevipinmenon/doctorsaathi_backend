import { Consult } from "../models/consult.model.js";

export const markConsultCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    const updatedConsult = await Consult.findByIdAndUpdate(
      id,
      { status: "approved", 
        doctor:doctorId,
        completedAt: new Date() },
      { new: true }
    );


    if (!updatedConsult) {
      return res.status(404).json({ message: "Consult not found" });
    }
   


    res.json({
      message: "Consult approved successfully. Will auto-delete in 2 days.",
      data: updatedConsult,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
