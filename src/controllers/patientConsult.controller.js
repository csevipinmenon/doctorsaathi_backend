import { PatientConsult } from "../models/patientCount.model.js";

export const savePatientConsult = async (req, res) => {
  try {
    const { doctorEmail } = req.params;

    if (!doctorEmail) {
      return res.status(400).json({ message: "Doctor email is required" });
    }

    const updatedRecord = await PatientConsult.findOneAndUpdate(
      { doctorEmail },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Patient consult count increased successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error saving patient consult:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDoctorPatientStats = async (req, res) => {
  try {
    const { doctorEmail } = req.params;

    if (!doctorEmail) {
      return res.status(400).json({ message: "Doctor email is required" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayCount = await PatientConsult.aggregate([
      {
        $match: {
          doctorEmail,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
        },
      },
    ]);

    const totalCount = await PatientConsult.aggregate([
      {
        $match: { doctorEmail },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
        },
      },
    ]);

    res.status(200).json({
      doctorEmail,
      todayCount: todayCount[0]?.total || 0,
      totalCount: totalCount[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching patient stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
