import express from "express";
import {
  signup,
  login,
  refreshToken,
  doctorProfile,
} from "../controllers/doctor.auth.controllers.js";
import {
  verifyToken,
  isDoctor,
  isAdmin,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  forgetPassword,
  verifyEmail,
} from "../controllers/doctor.passwordForget.controllers.js";
import { getPendingConsults } from "../controllers/getdoctorAllConsult.controller.js";
import {
  getDoctorPatientStats,
  savePatientConsult,
} from "../controllers/patientConsult.controller.js";
import { markConsultCompleted } from "../controllers/markConsultCompleted.controller.js";
import { addPrescription } from "../controllers/doctor.auth.controllers.js";

const router = express.Router();
router.post("/addPrescription",verifyToken,isDoctor,addPrescription)

router.post("/signup", upload.single("photo"),signup);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyemail",verifyEmail);
router.get("/profile", verifyToken, isDoctor, doctorProfile);
router.get("/pendingConsults", verifyToken, isDoctor, getPendingConsults);
router.post(
  "/patient-consult/:doctorEmail",
  verifyToken,
  isDoctor,
  savePatientConsult
);
router.get(
  "/patient-stats/:doctorEmail",
  verifyToken,
  isDoctor,
  getDoctorPatientStats
);
router.put("/consult/complete/:id",verifyToken,isDoctor, markConsultCompleted);

export default router;
