import { PatientConsult } from "../models/patientCount.model.js";
import Doctor from "../models/doctor.models.js";

export const savePatientConsult = async (req, res) => {
  try {
    const { doctorEmail } = req.params;

    if (!doctorEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor email is required" });
    }

    
    const doctor = await Doctor.findOne({ email: doctorEmail });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found in the system",
      });
    }

 
    let patientConsult = await PatientConsult.findOne({ doctorEmail });

    if (!patientConsult) {
     
      patientConsult = await PatientConsult.create({
        doctorEmail,
        count: 1,
      });

      return res.status(201).json({
        success: true,
        message: "New patient consult record created successfully",
        data: patientConsult,
      });
    } else {
      
      patientConsult.count = (patientConsult.count || 0) + 1;
      await patientConsult.save();

      return res.status(200).json({
        success: true,
        message: "Patient consult count updated successfully",
        data: patientConsult,
      });
    }
  } catch (error) {
    console.error("Error saving patient consult:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
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
