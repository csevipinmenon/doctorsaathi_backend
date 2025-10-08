import { Consult } from "../models/consult.model.js";
import User from "../models/user.models.js"
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const markConsultCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    // 1 Approve the consult
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

    // 3️Upsert users in Stream
    await serverClient.upsertUsers([
      { id: doctorId, name: "Doctor " + doctorId.slice(-4) },
      { id: patientId, name: "Patient " + patientId.slice(-4) },
    ]);

    
    const channel = serverClient.channel("messaging", {
      members: [doctorId, patientId],
      name: `Doctor_${doctorId}_Patient_${patientId}`,
    });

    await channel.create();

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