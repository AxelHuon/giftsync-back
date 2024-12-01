import * as fs from "node:fs";
import path from "path";
import {
  Body,
  Controller,
  FormField,
  Get,
  Middlewares,
  Patch,
  Path,
  Request,
  Res,
  Route,
  Tags,
  TsoaResponse,
  UploadedFile,
} from "tsoa";
import prisma from "../../config/prisma";

import {
  getToken,
  jwtVerify,
  securityMiddleware,
} from "../../middleware/auth.middleware";
import { validationBodyMiddleware } from "../../middleware/validation.middleware";
import { UserAttributes } from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";
import {
  UserClassEditPasswordRequest,
  UserClassEditPasswordResponse,
  UserClassEditResponse,
  UserClassGetResponse,
} from "./user.interface";

require("dotenv").config();

const bcrypt = require("bcrypt");

@Tags("User")
@Route("user")
export class UserController extends Controller {
  @Get("{userId}")
  @Middlewares([securityMiddleware])
  public async getUserById(
    @Path() userId: string,
    @Request() req: any,
    @Res()
    errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<UserClassGetResponse> {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        omit: { password: true },
      });
      if (!user) {
        return errorResponse(404, {
          message: "user not found",
          code: "user_not_found",
        });
      }
      this.setStatus(200);
      return user;
    } catch (err) {
      console.error("Error in getUserById:", err);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Patch("{userId}")
  @Middlewares([securityMiddleware])
  public async patchUser(
    @Res() errorResponse: TsoaResponse<400 | 401 | 404 | 500, ErrorResponse>,
    @Path() userId: string,
    @Request() req: any,
    @FormField() firstName?: string,
    @FormField() lastName?: string,
    @FormField() dateOfBirth?: Date,
    @UploadedFile() profilePicture?: Express.Multer.File,
  ): Promise<UserClassEditResponse> {
    try {
      const token = getToken(req.headers);
      const decodedToken = await jwtVerify(token);

      if ("code" in decodedToken || decodedToken.id !== userId) {
        return errorResponse(401, {
          message: "Unauthorized",
          code: "unauthorized",
        });
      }

      const user = await prisma.users.findUnique({
        where: { id: userId },
        omit: { password: true },
      });
      if (!user) {
        return errorResponse(404, {
          message: "UserModel not found",
          code: "user_not_found",
        });
      }

      const updateData: Partial<UserAttributes> = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (dateOfBirth !== undefined)
        updateData.dateOfBirth = new Date(dateOfBirth);

      if (profilePicture) {
        // Vérification du type de fichier
        const allowedMimeTypes = ["image/jpeg", "image/png"];
        if (!allowedMimeTypes.includes(profilePicture.mimetype)) {
          return errorResponse(400, {
            message: "Type de fichier non autorisé",
            code: "invalid_file_type",
          });
        }

        // Vérification de la taille du fichier (par exemple, limite à 5 MB)
        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (profilePicture.size > maxSize) {
          return errorResponse(400, {
            message: "Fichier trop volumineux",
            code: "file_too_large",
          });
        }

        // Génération d'un nom de fichier unique
        const fileExtension = path.extname(profilePicture.originalname);
        const uniqueFilename = `${crypto.randomUUID()}${fileExtension}`;
        const uploadDir = path.join(__dirname, "../../uploads/profil-pictures");
        const filePath = path.join(uploadDir, uniqueFilename);

        // Création du répertoire s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Écriture du fichier à partir du buffer
        try {
          await fs.promises.writeFile(filePath, profilePicture.buffer);
        } catch (err) {
          console.error("Erreur lors de l'écriture du fichier :", err);
          return errorResponse(500, {
            message: "Erreur lors du traitement de l'image",
            code: "file_processing_error",
          });
        }

        /*If user have already a profile picture delete it*/
        if (user.profilePicture) {
          const oldProfilePicturePath = path.join(
            __dirname,
            "../../uploads/profil-pictures",
            user.profilePicture.split("/").pop(),
          );
          if (fs.existsSync(oldProfilePicturePath)) {
            fs.unlinkSync(oldProfilePicturePath);
          }
        }

        updateData.profilePicture = `/uploads/profil-pictures/${uniqueFilename}`;
      }

      await prisma.users.update({
        where: { id: userId },
        data: updateData,
      });

      return { message: "UserModel updated", code: "user_updated" };
    } catch (err) {
      console.error("Error in patchUser:", err);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Patch("{userId}/edit-password")
  @Middlewares([
    securityMiddleware,
    validationBodyMiddleware(UserClassEditPasswordRequest),
  ])
  public async patchPassword(
    @Path() userId: string,
    @Request() req: any,
    @Body() body: UserClassEditPasswordRequest,
    @Res() errorResponse: TsoaResponse<400 | 401 | 404 | 500, ErrorResponse>,
  ): Promise<UserClassEditPasswordResponse> {
    try {
      const token = getToken(req.headers);
      const decodedToken = await jwtVerify(token);
      if ("code" in decodedToken || decodedToken.id !== userId) {
        return errorResponse(401, {
          message: "Unauthorized",
          code: "unauthorized",
        });
      }

      const user = await prisma.users.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return errorResponse(404, {
          message: "UserModel not found",
          code: "user_not_found",
        });
      }

      const { oldPassword, password, confirmPassword } = body;

      if (!(await bcrypt.compare(oldPassword, user.password))) {
        return errorResponse(400, {
          message: "Incorrect old password",
          code: "incorrect_old_password",
        });
      }

      if (password !== confirmPassword) {
        return errorResponse(400, {
          message: "Passwords do not match",
          code: "passwords_do_not_match",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      /*update password*/
      await prisma.users.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: "Password updated", code: "password_updated" };
    } catch (err) {
      console.error("Error in patchPassword:", err);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Get("{userId}/rooms")
  @Middlewares([securityMiddleware])
  public async getRoomOfAUser(
    @Request() req: any,
    @Path() userId: string,
    @Res() errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<any> {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        omit: { password: true },
      });
      return user;
    } catch (err) {
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }
}
