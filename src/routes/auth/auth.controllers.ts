import { Request, Response } from "express";
import AuthtokenModel from "../../models/authtoken.model";
import Authtoken from "../../models/authtoken.model";
import User from "../../models/user.model";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({
      where: { email },
    });

    if (userExists) {
      return res
        .status(400)
        .send("Email is already associated with an account");
    }
    await User.create({
      email,
      lastName,
      firstName,
      password: await bcrypt.hash(password, 12),
    });
    return res.status(200).send({ message: "Registration successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error in registering user" });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    const { email, password: passwordRequest } = req.body;
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
        return res.status(404).json("Incorrect email and password combination");
      }
      const token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: "24h",
      });

      let refreshToken = await AuthtokenModel.createToken(user);
      res.status(200).send({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: token,
        refreshToken,
      });
    } else {
      return res
        .status(402)
        .json({ message: "Incorrect email and password combination" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error in signIn user" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).send({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await AuthtokenModel.findOne({
      where: { token: requestToken },
    });
    if (!refreshToken) {
      res.status(403).send("Invalid refresh token");
      return;
    }
    if (Authtoken.verifyExpiration(refreshToken)) {
      await Authtoken.destroy({ where: { id: refreshToken.id } });
      res.status(403).send({
        message: "Refresh token was expired. Please make a new sign in request",
      });
      return;
    }

    const user = await User.findOne({
      where: { id: refreshToken.user },
      attributes: {
        exclude: ["password"],
      },
    });
    if (user) {
      let newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      });

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    }
  } catch (err) {
    console.log("err", err);
    return res.status(500).send("Internal server error");
  }
};
