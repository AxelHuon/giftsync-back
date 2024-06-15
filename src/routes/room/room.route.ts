import { verifyToken } from "../auth/auth.middleware";
import {
  addUserToRoom,
  createRoomController,
  deleteRoom,
  getSingleRoom,
} from "./room.controller";

const express = require("express");
const router = express.Router();

router.post("/create", verifyToken, createRoomController);
router.post("/:roomId/addUser", verifyToken, addUserToRoom);
router.get("/:roomId", verifyToken, getSingleRoom);
router.delete("/:roomId", verifyToken, deleteRoom);

export default router;
