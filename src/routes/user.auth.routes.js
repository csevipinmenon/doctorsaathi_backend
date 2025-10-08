import express from "express";
import {
  signup,
  login,
  refreshToken,
  userProfile,
} from "../controllers/user.auth.controller.js";
import {
  forgetPassword,
  verifyEmail,
} from "../controllers/user.password.controllers.js";

import { isUser } from "../middlewares/auth.middleware.js";
import {
  consultBook,
  getUserConsults,
  completeConsult,
} from "../controllers/consult.user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAashasForUser } from "../controllers/getAashasForUser.controller.js";
import { enquiry } from "../controllers/email.enquiry.controllers.js";
import { getUserPrescriptions } from "../controllers/doctor.auth.controllers.js";
import { generateToken } from "../controllers/toekn.controller.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyemail", verifyEmail);
router.get("/profile", verifyToken, userProfile);
router.post("/bookconsult", verifyToken, consultBook);
router.get("/getuser/consult/:email", verifyToken, getUserConsults);
router.delete("/complete/consult/:id", verifyToken, completeConsult);
router.get("/aashas", verifyToken, getAashasForUser);
router.post("/enquiry",enquiry)
router.get("/prescription",verifyToken,isUser,getUserPrescriptions)
router.get("/token/:userId",generateToken)

export default router;
