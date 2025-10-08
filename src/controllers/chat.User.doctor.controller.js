// import express from "express";
// import Message from "../models/Message.js";
// import consult from "../models/consult.model";

// const router = express.Router();

// // Get user's approved consultations
// router.get("/user/approvedConsults", authUser, async (req, res) => {
//   try {
//     const consults = await Consultation.find({
//       userEmail: req.user.email,
//       status: "approved",
//     });
//     res.json({ consultations: consults });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching consultations" });
//   }
// });

// //  Fetch chat messages
// router.get("/user/messages/:consultId", authUser, async (req, res) => {
//   try {
//     const messages = await Message.find({ consultId: req.params.consultId }).sort({ timestamp: 1 });
//     res.json({ messages });
//   } catch (err) {
//     res.status(500).json({ message: "Error loading messages" });
//   }
// });

// //  Send message (User → Doctor)
// router.post("/user/sendMessage", authUser, async (req, res) => {
//   try {
//     const { doctor, text } = req.body;
//     const consult = await Consultation.findOne({
//       userEmail: req.user.email,
//       doctorEmail: doctor,
//       status: "approved",
//     });
//     if (!consult) return res.status(404).json({ message: "Consultation not found" });

//     const newMsg = await Message.create({
//       consultId: consult.id,
//       sender: "user",
//       senderEmail: req.user.email,
//       text,
//       timestamp: new Date(),
//     });
//     res.json({ message: newMsg });
//   } catch (err) {
//     res.status(500).json({ message: "Error sending message" });
//   }
// });

// //  Doctor side endpoints
// router.get("/doctor/messages/:consultId", authDoctor, async (req, res) => {
//   try {
//     const messages = await Message.find({ consultId: req.params.consultId }).sort({ timestamp: 1 });
//     res.json({ messages });
//   } catch (err) {
//     res.status(500).json({ message: "Error loading messages" });
//   }
// });

// router.post("/doctor/sendMessage", authDoctor, async (req, res) => {
//   try {
//     const { user, text } = req.body;
//     const consult = await Consultation.findOne({
//       doctorEmail: req.doctor.email,
//       userEmail: user,
//       status: "approved",
//     });
//     if (!consult) return res.status(404).json({ message: "Consultation not found" });

//     const newMsg = await Message.create({
//       consultId: consult.id,
//       sender: "doctor",
//       senderEmail: req.doctor.email,
//       text,
//       timestamp: new Date(),
//     });
//     res.json({ message: newMsg });
//   } catch (err) {
//     res.status(500).json({ message: "Error sending message" });
//   }
// });

// export default router;