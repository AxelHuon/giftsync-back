import { Prisma } from "@prisma/client"; // Import de Prisma pour accéder aux types générés
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";
import { RegisterUserRequest } from "../routes/auth/auth.interface"; // Chemin vers votre configuration Prisma
const bcrypt = require("bcrypt");

export type UserAttributes = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  password: string;
  dateOfBirth: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserModel {
  static async createUser(
    user: RegisterUserRequest,
  ): Promise<Prisma.UsersCreateInput> {
    const userToCreate: Prisma.UsersCreateInput = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: await bcrypt.hash(user.password, 12),
      dateOfBirth: user.dateOfBirth,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return await prisma.users.create({
      data: userToCreate,
    });
  }
}
