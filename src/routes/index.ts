import { Router } from "express";
import authRoutes from "./auth/auth";
import usersRoutes from "./user/user.route";
import roomRoutes from "./room/room.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/room", roomRoutes);

export default router;
