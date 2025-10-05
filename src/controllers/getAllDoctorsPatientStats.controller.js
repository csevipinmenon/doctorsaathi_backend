import { PatientConsult } from "../models/patientCount.model.js";

export const getAllDoctorsPatientStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const stats = await PatientConsult.aggregate([
      {
        $group: {
          _id: "$doctorEmail",
          totalCount: { $sum: { $toInt: "$count" } },
          allRecords: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          doctorEmail: "$_id",
          totalCount: 1,
          todayCount: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$allRecords",
                    as: "record",
                    cond: {
                      $and: [
                        { $gte: ["$$record.createdAt", startOfDay] },
                        { $lte: ["$$record.createdAt", endOfDay] },
                      ],
                    },
                  },
                },
                as: "r",
                in: { $toInt: "$$r.count" },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching doctor stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
