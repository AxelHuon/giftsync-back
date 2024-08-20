import { Router } from "express";
import roomRoutes from "./room/room.route";
import usersRoutes from "./user/user.route";

const router = Router();

router.use("/user", usersRoutes);
router.use("/room", roomRoutes);

export default router;
