import { Router } from "express";
import authRoutes from "./auth/auth";
import roomRoutes from "./room/room.route";
import usersRoutes from "./user/user.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", usersRoutes);
router.use("/room", roomRoutes);

export default router;
