"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_process_1 = __importDefault(require("node:process"));
const tsoa_1 = require("tsoa");
const mailConfig_1 = __importDefault(require("../../config/mailConfig"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const authToken_model_1 = require("../../models/authToken.model");
const authTokenForgotPasswords_model_1 = require("../../models/authTokenForgotPasswords.model");
const user_model_1 = require("../../models/user.model");
const auth_interface_1 = require("./auth.interface");
const bcrypt = require("bcrypt");
require("dotenv").config();
const frontUrl = node_process_1.default.env.FRONTEND_URL;
let AuthController = class AuthController extends tsoa_1.Controller {
    registerUser(body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, email, password, dateOfBirth } = body;
                const userExists = yield prisma_1.default.users.findUnique({ where: { email } });
                if (userExists) {
                    return errorResponse(400, {
                        message: "Email is already associated with an account",
                        code: "email_already_exists",
                    });
                }
                this.setStatus(200);
                yield user_model_1.UserModel.createUser(body);
                return {
                    message: "UserModel successfully registered",
                    code: "success_register",
                };
            }
            catch (error) {
                console.log(error);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    signInUser(body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const secretKey = node_process_1.default.env.JWT_SECRET;
            try {
                const { email, password: passwordRequest } = body;
                if (!email || !passwordRequest) {
                    return errorResponse(400, {
                        message: "Email and password are required",
                        code: "email_and_password_required",
                    });
                }
                const user = yield prisma_1.default.users.findUnique({
                    where: { email },
                });
                if (user) {
                    const passwordValid = yield bcrypt.compare(passwordRequest, user.password);
                    if (!passwordValid) {
                        return errorResponse(400, {
                            message: "Incorrect email and password combination",
                            code: "error_signIn_combination",
                        });
                    }
                    const tokenExists = yield prisma_1.default.authTokens.findMany({
                        where: { user: user.id },
                    });
                    if (tokenExists) {
                        /*for tokenExist delete*/
                        yield prisma_1.default.authTokens.deleteMany({
                            where: { user: user.id },
                        });
                    }
                    const refreshToken = yield authToken_model_1.AuthTokenModel.createToken(user.id);
                    const token = jsonwebtoken_1.default.sign({ id: user.id }, secretKey !== null && secretKey !== void 0 ? secretKey : "", {
                        expiresIn: node_process_1.default.env.JWT_EXPIRATION || "24h",
                    });
                    this.setStatus(200);
                    return {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        profilePicture: user === null || user === void 0 ? void 0 : user.profilePicture,
                        accessToken: token,
                        dateOfBirth: user.dateOfBirth,
                        refreshToken,
                    };
                }
                else {
                    return errorResponse(400, {
                        message: "Incorrect email and password combination",
                        code: "error_signIn_combination",
                    });
                }
            }
            catch (error) {
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    refreshToken(body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { refreshToken: requestToken } = body;
            if (!requestToken) {
                return errorResponse(403, {
                    message: "Refresh Token is required!",
                    code: "refresh_token_required",
                });
            }
            try {
                const refreshToken = yield prisma_1.default.authTokens.findUnique({
                    where: { token: requestToken },
                });
                if (!refreshToken) {
                    return errorResponse(404, {
                        message: "Invalid refresh token",
                        code: "invalid_refresh_token",
                    });
                }
                const isExpired = yield authToken_model_1.AuthTokenModel.verifyAndDeleteExpiredToken(refreshToken);
                if (isExpired) {
                    return errorResponse(403, {
                        message: "Refresh token was expired. Please make a new sign in request",
                        code: "expired_refresh_token",
                    });
                }
                const user = yield prisma_1.default.users.findUnique({
                    where: { id: refreshToken.user },
                    omit: { password: true },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "UserModel not found",
                        code: "user_not_found",
                    });
                }
                const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id }, (_a = node_process_1.default.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "", {
                    expiresIn: node_process_1.default.env.JWT_EXPIRATION || "24h",
                });
                const newRefreshToken = yield authToken_model_1.AuthTokenModel.createToken(user.id);
                yield prisma_1.default.authTokens.delete({ where: { id: refreshToken.id } });
                this.setStatus(200);
                return {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                };
            }
            catch (err) {
                console.log("err", err);
                return errorResponse(500, {
                    message: "Internal server error",
                    code: "internal_server_error",
                });
            }
        });
    }
    forgotPassword(body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = body;
            if (!email) {
                return errorResponse(403, {
                    message: "Email is required",
                    code: "email_is_required",
                });
            }
            try {
                const user = yield prisma_1.default.users.findUnique({
                    where: { email: email },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "No user found",
                        code: "no_user_found",
                    });
                }
                const forgotPasswordToken = yield authTokenForgotPasswords_model_1.AuthTokenForgotPasswordModel.createForgotPasswordToken(user.id);
                if (forgotPasswordToken) {
                    const url = `${node_process_1.default.env.FRONTEND_URL}/auth/reset-password?token=${forgotPasswordToken}`;
                    yield this.sendEmailForgotPassword(email, url);
                    this.setStatus(200);
                    return {
                        message: `${forgotPasswordToken}`,
                        code: "email_sent",
                    };
                }
            }
            catch (err) {
                return errorResponse(500, {
                    message: "Internal server error",
                    code: "internal_server_error",
                });
            }
        });
    }
    resetPassword(body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = body;
                if (!newPassword) {
                    return errorResponse(403, {
                        message: "Password is required!",
                        code: "password_required",
                    });
                }
                if (!token) {
                    return errorResponse(403, {
                        message: "No token provided",
                        code: "no_token_provided",
                    });
                }
                const tokenInformation = yield prisma_1.default.authTokenForgotPasswords.findUnique({
                    where: { token: token },
                });
                const isExpired = yield authTokenForgotPasswords_model_1.AuthTokenForgotPasswordModel.verifyAndDeleteExpiredTokenForgotPassword(tokenInformation);
                if (isExpired) {
                    return errorResponse(403, {
                        message: "Token was expired. Please make a new sign in request",
                        code: "token_refresh_token",
                    });
                }
                const user = yield prisma_1.default.users.findUnique({
                    where: { id: tokenInformation.user },
                });
                if (user) {
                    user.password = yield bcrypt.hash(newPassword, 12);
                    yield prisma_1.default.authTokenForgotPasswords.delete({
                        where: { id: tokenInformation.id },
                    });
                    /*update user*/
                    yield prisma_1.default.users.update({
                        where: { id: user.id },
                        data: {
                            password: user.password,
                        },
                    });
                    this.setStatus(200);
                    return {
                        message: "Password changed successfully",
                        code: "password_changed",
                    };
                }
                else {
                    return errorResponse(403, {
                        message: "No UserModel found",
                        code: "no_user_found",
                    });
                }
            }
            catch (err) {
                console.log("err", err);
                return errorResponse(500, {
                    message: "Internal server error",
                    code: "internal_server_error",
                });
            }
        });
    }
    generateEmailContent(email, url) {
        return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gift Sync - Réinitialisation de votre mot de passe</title>
    </head>
    <body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA; color: #1F1F1F;">
        <div style="text-align: center; padding-top: 20px; padding-bottom: 20px;">
            <img src="https://www.giftsync.fr/images/gslogo.png" alt="Logo" style="width: 200px; max-width: 100%; height: auto; margin-bottom: 20px;">
            <h1 style="color: #4747FF; margin: 0; font-size: 24px; font-weight: bold;">Réinitialisation de votre mot de passe</h1>
        </div>
        <div style="text-align: center; padding-top: 20px;">
            <p style="margin-bottom: 15px;">Bonjour,</p>
            <p style="margin-bottom: 15px;">Vous avez demandé à réinitialiser votre mot de passe pour le compte ${email}</p>
            <p style="margin-bottom: 30px;">Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe.</p>
            <a style="padding: 12px;text-decoration: none; background:#4747FF; color:#FAFAFA; border-radius: 12px;margin-bottom: 30px; font-weight: 500" href="${url}">Réinitialiser mon mot de passe</a>
            <p style="margin-top: 30px">Si ce n'est pas vous qui êtes a l'origine de cette modification de mot de passe veuillez contacter le support <a href="mailto:support@giftsync.fr">ici</a></p>
        </div>
    </body>
    </html>
  `;
    }
    sendEmailForgotPassword(email, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentMail = this.generateEmailContent(email, url);
            const mailOptions = {
                from: "noreply@giftsync.fr",
                to: email,
                subject: "Gift Sync - Réinitialisation de votre mot de passe",
                html: contentMail,
            };
            yield mailConfig_1.default.sendMail(mailOptions);
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.Post)("signup"),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(auth_interface_1.RegisterUserRequest)]),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)())
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, tsoa_1.Post)("signin"),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(auth_interface_1.SignInUserRequest)]),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)())
], AuthController.prototype, "signInUser", null);
__decorate([
    (0, tsoa_1.Post)("refresh-token"),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(auth_interface_1.RefreshTokenRequest)]),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)())
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, tsoa_1.Post)("forgot-password"),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(auth_interface_1.ForgotPasswordRequest)]),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)())
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, tsoa_1.Put)("reset-password"),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(auth_interface_1.ResetPasswordRequest)]),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)())
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Tags)("Auth"),
    (0, tsoa_1.Route)("auth")
], AuthController);
