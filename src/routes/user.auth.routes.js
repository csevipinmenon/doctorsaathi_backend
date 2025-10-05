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
import {
  consultBook,
  getUserConsults,
  cancelConsult,
} from "../controllers/consult.user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAashasForUser } from "../controllers/getAashasForUser.controller.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyemail", verifyEmail);
router.get("/profile", verifyToken, userProfile);
router.post("/bookconsult", verifyToken, consultBook);
router.get("/getuser/consult/:email", verifyToken, getUserConsults);
router.delete("/deleteuser/consult/:id", verifyToken, cancelConsult);
router.get("/aashas", verifyToken, getAashasForUser);

export default router;
