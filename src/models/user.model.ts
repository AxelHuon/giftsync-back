import { Prisma } from "@prisma/client"; // Import de Prisma pour accéder aux types générés
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";

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

interface createUserInterface {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  dateOfBirth?: Date;
  profilePicture?: string;
}

export class UserModel {
  static async createUser(
    user: createUserInterface,
  ): Promise<Prisma.UsersCreateInput> {
    const userToCreate: Prisma.UsersCreateInput = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (user.profilePicture) {
      userToCreate.profilePicture = user.profilePicture;
    }

    if (user.password) {
      userToCreate.password = await bcrypt.hash(user.password, 10);
    }
    if (user.dateOfBirth) {
      userToCreate.dateOfBirth = user.dateOfBirth;
    }

    return await prisma.users.create({
      data: userToCreate,
    });
  }
}
