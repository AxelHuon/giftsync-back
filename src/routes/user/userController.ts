import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getToken } from "../../middleware/auth.middleware";
import User from "../../models/user.model";

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

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = getToken(req.headers);
    if (!token) {
      return res.status(401).send({
        message: "No token provided",
        code: "token_missing",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
    if (typeof decodedToken !== "object" || !("id" in decodedToken)) {
      return res.status(401).send({
        message: "Invalid token",
        code: "invalid_token",
      });
    }

    const user = await User.findOne({
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
  } catch (err) {
    console.error("Error retrieving user:", err);
    return res.status(500).send({
      message: "Sorry, an error occurred.",
      code: "internal_server_error",
    });
  }
};

export const getRoomOfUserConnected = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = getToken(req.headers);
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        const user = await User.findOne({
          where: { id: decodedToken.id },
          attributes: { exclude: ["password"] },
        });

        if (user) {
          const rooms = await user.getRooms({
            include: [
              {
                model: User,
                as: "users",
                through: {
                  attributes: [],
                },
              },
            ],
            attributes: { exclude: ["createdAt", "updatedAt"] },
          });

          res.status(200).send(rooms);
        } else {
          res.status(404).send({ statusCode: 500, message: "User not found" });
        }
      }
    } else {
      res.status(403).send({ message: "No token provided!" });
    }
  } catch (err) {
    next(err);
  }
};
