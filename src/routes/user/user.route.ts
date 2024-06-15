import { getMe, getRoomOfUserConnected } from "./user.controller";
import { verifyToken } from "../auth/auth.middleware";

const express = require("express");
const router = express.Router();

router.get("/me", verifyToken, getMe);
router.get("/rooms", verifyToken, getRoomOfUserConnected);

export default router;
