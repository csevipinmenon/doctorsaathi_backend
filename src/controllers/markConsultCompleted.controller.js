import { Consult } from "../models/consult.model.js";
import User from "../models/user.models.js";
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const markConsultCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    //  Approve the consult
    const updatedConsult = await Consult.findByIdAndUpdate(
      id,
      {
        status: "approved",
        doctor: doctorId,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedConsult) {
      return res.status(404).json({ message: "Consult not found" });
    }

    // Get patient _id from userEmail
    const patient = await User.findOne({ email: updatedConsult.userEmail });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const patientId = patient._id.toString();

    // 3 Upsert both users in Stream
    await serverClient.upsertUsers([
      { id: doctorId, name: "Doctor " + doctorId.slice(-4) },
      { id: patientId, name: "Patient " + patientId.slice(-4) },
    ]);

    // Create or get channel (avoid duplicate errors)
    const channel = serverClient.channel("messaging", {
      members: [doctorId, patientId],
      // Use unique ID to prevent duplicate creation
      id: `doctor_${doctorId}_patient_${patientId}`,
      name: `Doctor_${doctorId}_Patient_${patientId}`,
    });

    // If channel exists, create() just returns existing channel, safe to call
    await channel.create().catch((err) => {
      if (!err.message.includes("already exists")) throw err;
    });

    res.json({
      message: "Consult approved and chat created automatically",
      data: updatedConsult,
      channelId: channel.id,
    });
  } catch (error) {
    console.error("Error approving consult or creating chat:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
