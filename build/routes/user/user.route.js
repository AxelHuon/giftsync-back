"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const express = require("express");
const router = express.Router();
router.get("/me", auth_middleware_1.verifyToken, user_controller_1.getMe);
router.get("/rooms", auth_middleware_1.verifyToken, user_controller_1.getRoomOfUserConnected);
exports.default = router;
