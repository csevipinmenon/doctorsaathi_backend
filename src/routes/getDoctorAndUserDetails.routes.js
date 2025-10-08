import express from "express";
import  {getDoctorAndUserDetails} from "../controllers/getDoctorAndUserDetails.controller.js"

const router = express.Router();
router.get("/getUserDoctor/details/:doctorId/:userId", getDoctorAndUserDetails);


export default router;
