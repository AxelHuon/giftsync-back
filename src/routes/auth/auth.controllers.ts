import { Request, Response } from "express";
import AuthtokenModel from "../../models/authtoken.model";
import User from "../../models/user.model";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegisterRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       example:
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john.doe@example.com"
 *         password: "securePassword123"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         code:
 *           type: string
 *           description: Error code
 *       example:
 *         message: "An error occurred"
 *         code: "error_code"
 *
 *     UserRegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         code:
 *           type: string
 *           description: Success code
 *       example:
 *         message: "User successfully registered"
 *         code: "success_register"
 *
 *     UserLoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password
 *       required:
 *         - email
 *         - password
 *       example:
 *         email: "john.doe@example.com"
 *         password: "securePassword123"
 *
 *     UserLoginResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user's ID
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john.doe@example.com"
 *         accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
 *
 *     RefreshTokenRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: The refresh token
 *       required:
 *         - refreshToken
 *       example:
 *         refreshToken: "existing-refresh-token"
 *
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The new access token
 *         refreshToken:
 *           type: string
 *           description: The new refresh token
 *       example:
 *         accessToken: "new-access-token"
 *         refreshToken: "new-refresh-token"
 */

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
 *             $ref: '#/components/schemas/UserRegisterRequest'
 *     responses:
 *       200:
 *         description: Successful registration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRegisterResponse'
 *       400:
 *         description: Bad Request - Email is already associated with an account
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
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

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
 *             $ref: '#/components/schemas/UserLoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLoginResponse'
 *       400:
 *         description: Bad Request - Email and password are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Incorrect email and password combination
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
      const passwordValid = await bcrypt.compare(
        passwordRequest,
        user.password,
      );
      if (!passwordValid) {
        return res.status(401).json({
          message: "Incorrect email and password combination",
          code: "error_signIn_combination",
        });
      }

      const token = jwt.sign({ id: user.id }, secretKey ?? "", {
        expiresIn: "2h",
      });
      const refreshToken = await AuthtokenModel.createToken(user);

      return res.status(200).send({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: token,
        refreshToken,
      });
    } else {
      return res.status(404).json({
        message: "User not found",
        code: "user_not_found",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error in signIn user",
      code: "error_signIn_server",
    });
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
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: New access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       403:
 *         description: Forbidden - Refresh token is required or has expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Not Found - Refresh token or user not found
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
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
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
      attributes: { exclude: ["password"] },
    });

    if (user) {
      const newAccessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET ?? "",
        {
          expiresIn: process.env.JWT_EXPIRATION || "24h",
        },
      );

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
