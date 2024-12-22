"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const fs = __importStar(require("node:fs"));
const path_1 = __importDefault(require("path"));
const tsoa_1 = require("tsoa");
const prisma_1 = __importDefault(require("../../config/prisma"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const user_interface_1 = require("./user.interface");
require("dotenv").config();
const bcrypt = require("bcrypt");
let UserController = class UserController extends tsoa_1.Controller {
    getUserById(userId, req, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.users.findUnique({
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
            }
            catch (err) {
                console.error("Error in getUserById:", err);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    patchUser(errorResponse, userId, req, firstName, lastName, dateOfBirth, profilePicture) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers);
                const decodedToken = yield (0, auth_middleware_1.jwtVerify)(token);
                if ("code" in decodedToken || decodedToken.id !== userId) {
                    return errorResponse(401, {
                        message: "Unauthorized",
                        code: "unauthorized",
                    });
                }
                const user = yield prisma_1.default.users.findUnique({
                    where: { id: userId },
                    omit: { password: true },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "UserModel not found",
                        code: "user_not_found",
                    });
                }
                const updateData = {};
                if (firstName !== undefined)
                    updateData.firstName = firstName;
                if (lastName !== undefined)
                    updateData.lastName = lastName;
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
                    const fileExtension = path_1.default.extname(profilePicture.originalname);
                    const uniqueFilename = `${crypto.randomUUID()}${fileExtension}`;
                    const uploadDir = path_1.default.join(__dirname, "../../uploads/profil-pictures");
                    const filePath = path_1.default.join(uploadDir, uniqueFilename);
                    // Création du répertoire s'il n'existe pas
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    // Écriture du fichier à partir du buffer
                    try {
                        yield fs.promises.writeFile(filePath, profilePicture.buffer);
                    }
                    catch (err) {
                        console.error("Erreur lors de l'écriture du fichier :", err);
                        return errorResponse(500, {
                            message: "Erreur lors du traitement de l'image",
                            code: "file_processing_error",
                        });
                    }
                    /*If user have already a profile picture delete it*/
                    if (user.profilePicture) {
                        const oldProfilePicturePath = path_1.default.join(__dirname, "../../uploads/profil-pictures", user.profilePicture.split("/").pop());
                        if (fs.existsSync(oldProfilePicturePath)) {
                            fs.unlinkSync(oldProfilePicturePath);
                        }
                    }
                    updateData.profilePicture = `/uploads/profil-pictures/${uniqueFilename}`;
                }
                yield prisma_1.default.users.update({
                    where: { id: userId },
                    data: updateData,
                });
                return { message: "UserModel updated", code: "user_updated" };
            }
            catch (err) {
                console.error("Error in patchUser:", err);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    patchPassword(userId, req, body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers);
                const decodedToken = yield (0, auth_middleware_1.jwtVerify)(token);
                if ("code" in decodedToken || decodedToken.id !== userId) {
                    return errorResponse(401, {
                        message: "Unauthorized",
                        code: "unauthorized",
                    });
                }
                const user = yield prisma_1.default.users.findUnique({
                    where: { id: userId },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "UserModel not found",
                        code: "user_not_found",
                    });
                }
                const { oldPassword, password, confirmPassword } = body;
                if (!(yield bcrypt.compare(oldPassword, user.password))) {
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
                const hashedPassword = yield bcrypt.hash(password, 12);
                /*update password*/
                yield prisma_1.default.users.update({
                    where: { id: userId },
                    data: { password: hashedPassword },
                });
                return { message: "Password updated", code: "password_updated" };
            }
            catch (err) {
                console.error("Error in patchPassword:", err);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    getRoomsOfUser(userId, req, errorResponse, queryString) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers);
                const verifiedToken = yield (0, auth_middleware_1.jwtVerify)(token);
                if ("code" in verifiedToken) {
                    return errorResponse(401, {
                        message: verifiedToken.message,
                        code: verifiedToken.code,
                    });
                }
                if (verifiedToken.id !== userId) {
                    return errorResponse(401, {
                        message: "Unauthorized",
                        code: "unauthorized",
                    });
                }
                const user = yield prisma_1.default.users.findUnique({
                    where: { id: verifiedToken.id },
                    include: { RoomUsers: true },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                const rooms = ((_a = user.RoomUsers) === null || _a === void 0 ? void 0 : _a.map((room) => room.roomId)) || [];
                // Query the rooms based on the optional queryString
                const roomsOfTheUser = yield prisma_1.default.rooms.findMany({
                    where: Object.assign({ id: { in: rooms } }, (queryString && queryString !== ""
                        ? {
                            OR: [{ title: { contains: queryString, mode: "insensitive" } }],
                        }
                        : {})),
                    include: {
                        RoomUsers: {
                            include: {
                                Users: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        profilePicture: true,
                                    },
                                },
                            },
                        },
                    },
                });
                const transformedRooms = roomsOfTheUser.map((_a) => {
                    var { RoomUsers } = _a, rest = __rest(_a, ["RoomUsers"]);
                    return (Object.assign(Object.assign({}, rest), { users: RoomUsers.map((roomUser) => roomUser.Users), isOwner: rest.ownerId === user.id }));
                });
                this.setStatus(200);
                return {
                    rooms: transformedRooms,
                    total: transformedRooms.length,
                };
            }
            catch (error) {
                console.error("Error fetching rooms of user:", error);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Get)("{userId}"),
    (0, tsoa_1.Middlewares)([auth_middleware_1.securityMiddleware]),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Res)())
], UserController.prototype, "getUserById", null);
__decorate([
    (0, tsoa_1.Patch)("{userId}"),
    (0, tsoa_1.Middlewares)([auth_middleware_1.securityMiddleware]),
    __param(0, (0, tsoa_1.Res)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Request)()),
    __param(3, (0, tsoa_1.FormField)()),
    __param(4, (0, tsoa_1.FormField)()),
    __param(5, (0, tsoa_1.FormField)()),
    __param(6, (0, tsoa_1.UploadedFile)())
], UserController.prototype, "patchUser", null);
__decorate([
    (0, tsoa_1.Patch)("{userId}/edit-password"),
    (0, tsoa_1.Middlewares)([
        auth_middleware_1.securityMiddleware,
        (0, validation_middleware_1.validationBodyMiddleware)(user_interface_1.UserClassEditPasswordRequest),
    ]),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Body)()),
    __param(3, (0, tsoa_1.Res)())
], UserController.prototype, "patchPassword", null);
__decorate([
    (0, tsoa_1.Get)("/:userId/rooms"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Res)()),
    __param(3, (0, tsoa_1.Query)())
], UserController.prototype, "getRoomsOfUser", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Tags)("User"),
    (0, tsoa_1.Route)("user")
], UserController);
