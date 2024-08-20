"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomOfUserConnected = exports.getMe = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const auth_middleware_1 = require("../auth/auth.middleware");
/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Retrieve the authenticated user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user's ID
 *                 firstName:
 *                   type: string
 *                   description: The user's first name
 *                 lastName:
 *                   type: string
 *                   description: The user's last name
 *                 email:
 *                   type: string
 *                   description: The user's email
 *               example:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, auth_middleware_1.getToken)(req.headers);
        if (!token) {
            return res.status(401).send({
                message: "No token provided",
                code: "token_missing",
            });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        if (typeof decodedToken !== "object" || !("id" in decodedToken)) {
            return res.status(401).send({
                message: "Invalid token",
                code: "invalid_token",
            });
        }
        const user = yield user_model_1.default.findOne({
            where: { id: decodedToken.id },
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            return res.status(404).send({
                message: "User not found",
                code: "user_not_found",
            });
        }
        return res.status(200).json(user);
    }
    catch (err) {
        console.error("Error retrieving user:", err);
        return res.status(500).send({
            message: "Sorry, an error occurred.",
            code: "internal_server_error",
        });
    }
});
exports.getMe = getMe;
const getRoomOfUserConnected = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, auth_middleware_1.getToken)(req.headers);
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            if (typeof decodedToken === "object" && "id" in decodedToken) {
                const user = yield user_model_1.default.findOne({
                    where: { id: decodedToken.id },
                    attributes: { exclude: ["password"] },
                });
                if (user) {
                    const rooms = yield user.getRooms({
                        include: [
                            {
                                model: user_model_1.default,
                                as: "users",
                                through: {
                                    attributes: [],
                                },
                            },
                        ],
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    });
                    res.status(200).send(rooms);
                }
                else {
                    res.status(404).send({ statusCode: 500, message: "User not found" });
                }
            }
        }
        else {
            res.status(403).send({ message: "No token provided!" });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.getRoomOfUserConnected = getRoomOfUserConnected;
