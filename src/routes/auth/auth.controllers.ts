import { Request, Response } from "express";
import AuthtokenModel from "../../models/authtoken.model";
import User from "../../models/user.model";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'auth
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             example:
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john.doe@example.com"
 *               password: "securePassword123"
 *     responses:
 *       200:
 *         description: Successful registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 code:
 *                   type: string
 *                   description: Success code
 *               example:
 *                 message: "User successfully registered"
 *                 code: "success_register"
 *       400:
 *         description: Bad Request - Email is already associated with an account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: string
 *                   description: Error code
 *               example:
 *                 message: "Email is already associated with an account"
 *                 code: "email_already_exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: string
 *                   description: Error code
 *               example:
 *                 message: "Error in registering user"
 *                 code: "error_register_server"
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    const userExists = await User.findOne({
      where: { email },
    });

    if (userExists) {
      return res.status(400).send({
        message: "Email is already associated with an account",
        code: "email_already_exists",
      });
    }
    await User.create({
      email,
      lastName,
      firstName,
      password: await bcrypt.hash(password, 12),
    });
    return res.status(200).send({
      message: "User successfully registered",
      code: "success_register",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error in registering user",
      code: "error_register_server",
    });
  }
};

/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: "john.doe@example.com"
 *               password: "securePassword123"
 *     responses:
 *       200:
 *         description: Successful login
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
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *               example:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
 *       400:
 *         description: Bad Request - Email and password are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: string
 *                   description: Error code
 *               example:
 *                 message: "Email and password are required"
 *                 code: "email_and_password_required"
 *       401:
 *         description: Unauthorized - Incorrect email and password combination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: string
 *                   description: Error code
 *               example:
 *                 message: "Incorrect email and password combination"
 *                 code: "error_signIn_combination"
 *       404:
 *         description: Not Found - Incorrect email and password combination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: string
 *                   description: Error code
 *               example:
 *                 message: "Incorrect email and password combination"
 *                 code: "invalid_email_or_password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: string
 *                   description: Error code
 *               example:
 *                 message: "Error in signIn user"
 *                 code: "error_signIn_server"
 */
export const signInUser = async (req: Request, res: Response) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    const { email, password: passwordRequest } = req.body;

    if (!email || !passwordRequest) {
      return res.status(400).json({
        message: "Email and password are required",
        code: "email_and_password_required",
      });
    }

    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      const { password: currentPassword } = user;
      const passwordValid = await bcrypt.compare(
        passwordRequest,
        currentPassword,
      );
      if (!passwordValid) {
        return res.status(404).json({
          message: "Incorrect email and password combination",
          code: "invalid_email_or_password",
        });
      }
      const token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: "2h",
      });
      let refreshToken = await AuthtokenModel.createToken(user);
      res.status(200).send({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: token,
        refreshToken: refreshToken,
      });
    } else {
      return res.status(401).json({
        message: "Incorrect email and password combination",
        code: "error_signIn_combination",
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "Error in signIn user", code: "error_signIn_server" });
  }
};

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using a valid refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *             required:
 *               - refreshToken
 *             example:
 *               refreshToken: "existing-refresh-token"
 *     responses:
 *       200:
 *         description: New access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token
 *                 refreshToken:
 *                   type: string
 *                   description: The new refresh token
 *               example:
 *                 accessToken: "new-access-token"
 *                 refreshToken: "new-refresh-token"
 *       403:
 *         description: Forbidden - Refresh token is required or has expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: string
 *                   description: Error code
 *               examples:
 *                 missingToken:
 *                   value:
 *                     message: "Refresh Token is required!"
 *                     code: "refresh_token_required"
 *                 expiredToken:
 *                   value:
 *                     message: "Refresh token was expired. Please make a new sign in request"
 *                     code: "expired_refresh_token"
 *       404:
 *         description: Not Found - Refresh token or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: string
 *                   description: Error code
 *               examples:
 *                 invalidToken:
 *                   value:
 *                     message: "Invalid refresh token"
 *                     code: "invalid_refresh_token"
 *                 userNotFound:
 *                   value:
 *                     message: "User not found"
 *                     code: "user_not_found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 code:
 *                   type: string
 *                   description: Error code
 *               example:
 *                 message: "Internal server error"
 *                 code: "internal_server_error"
 */

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).send({
      message: "Refresh Token is required!",
      code: "refresh_token_required",
    });
  }

  try {
    const refreshToken = await AuthtokenModel.findOne({
      where: { token: requestToken },
    });

    if (!refreshToken) {
      return res.status(404).send({
        message: "Invalid refresh token",
        code: "invalid_refresh_token",
      });
    }

    const isExpired =
      await AuthtokenModel.verifyAndDeleteExpiredToken(refreshToken);
    if (isExpired) {
      return res.status(403).send({
        message: "Refresh token was expired. Please make a new sign in request",
        code: "expired_refresh_token",
      });
    }

    const user = await User.findOne({
      where: { id: refreshToken.user },
      attributes: {
        exclude: ["password"],
      },
    });

    if (user) {
      const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION || "24h",
      });

      const newRefreshToken = await AuthtokenModel.createToken(user);

      await AuthtokenModel.destroy({ where: { id: refreshToken.id } });

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } else {
      return res.status(404).send({
        message: "User not found",
        code: "user_not_found",
      });
    }
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({
      message: "Internal server error",
      code: "internal_server_error",
    });
  }
};
