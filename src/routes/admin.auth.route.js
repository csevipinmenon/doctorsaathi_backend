import express from "express";
import {
  adminProfile,
  getAllDoctors,
  getAllUsers,
  exportAlldoctors,
  exportAllusers,
  getAllAasha,
  exportAllAasha,
  removeAashaByEmail,
  removeDoctorByEmail,
  removeUserByEmail,
  addAasha
} from "../controllers/admin.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import { getallConsults } from "../controllers/admin.controller.js";
import { getAllDoctorsPatientStats } from "../controllers/getAllDoctorsPatientStats.controller.js";
import {getAllPatientConsults} from "../controllers/admin.controller.js"
const router = express.Router();
router.post("/aashaRegister", verifyToken, isAdmin,addAasha);
router.get("/profile", verifyToken, isAdmin, adminProfile);
router.get("/allusers", verifyToken, isAdmin, getAllUsers);
router.get("/alldoctors", verifyToken, isAdmin, getAllDoctors);
router.get("/all-aashas", verifyToken, isAdmin, getAllAasha);
router.get("/exportall-aashas", verifyToken, isAdmin, exportAllAasha);
router.get("/exportallusers", verifyToken, isAdmin, exportAllusers);
router.get("/exportsalldoctors", verifyToken, isAdmin, exportAlldoctors);
router.get("/allConsults", verifyToken, isAdmin, getallConsults);
router.get(
  "/doctors-patient-stats",
  verifyToken,
  isAdmin,
  getAllDoctorsPatientStats
);

router.get("/deletedoctor", verifyToken, isAdmin, removeDoctorByEmail);
router.get("/deleteuser", verifyToken, isAdmin, removeUserByEmail);
router.get("/deleteAasha", verifyToken, isAdmin, removeAashaByEmail);
router.get("/alldoctors-stats",verifyToken,isAdmin,getAllPatientConsults)

export default router;
