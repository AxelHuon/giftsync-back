import { verifyToken } from "../auth/auth.middleware";
import {
  addUserToRoom,
  createRoom,
  deleteRoom,
  deleteUserFromARoom,
  getSingleRoom,
  putNameOfRoom,
} from "./room.controller";

const express = require("express");
const router = express.Router();

router.post("/create", verifyToken, createRoom);
router.post("/:roomId/add-user", verifyToken, addUserToRoom);
router.delete("/:roomId/delete-user", verifyToken, deleteUserFromARoom);
router.put("/:roomId", verifyToken, putNameOfRoom);
router.get("/:roomId", verifyToken, getSingleRoom);
router.delete("/:roomId", verifyToken, deleteRoom);

export default router;
