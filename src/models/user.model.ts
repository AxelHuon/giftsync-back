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
      dateOfBirth: user.dateOfBirth,
      profilePicture: user.profilePicture,
      password: user.password
        ? await bcrypt.hash(user.password, 10)
        : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    /*Remove undefined value from userToCreate */
    Object.keys(userToCreate).forEach(
      (key) => userToCreate[key] === undefined && delete userToCreate[key],
    );

    return await prisma.users.create({
      data: userToCreate,
    });
  }
}
