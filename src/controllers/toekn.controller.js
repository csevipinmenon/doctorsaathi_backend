import { StreamChat } from "stream-chat";
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const generateToken = async (req, res) => {
  try {
    const { userId } = req.params;

    
    const token = serverClient.createToken(userId);

    // upsert user in Stream
    await serverClient.upsertUser({
      id: userId,
      name: userId.startsWith("doctor")
        ? "Doctor " + userId.slice(-4)
        : "Patient " + userId.slice(-4),
    });

    res.json({ token });
  } catch (error) {
    console.error("Token error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
};