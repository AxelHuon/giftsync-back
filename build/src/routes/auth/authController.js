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
const tsoa_1 = require("tsoa");
const authtoken_model_1 = __importDefault(require("../../models/authtoken.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const bcrypt = require("bcrypt");
let AuthController = class AuthController extends tsoa_1.Controller {
    registerUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = body;
            const userExists = yield user_model_1.default.findOne({
                where: { email },
            });
            if (userExists) {
                this.setStatus(400); // you can set the response status code manually
                return {
                    message: "Email is already associated with an account",
                    code: "email_already_exists",
                };
            }
            yield user_model_1.default.create({
                email,
                lastName,
                firstName,
                password: yield bcrypt.hash(password, 12),
            });
            this.setStatus(200);
            return {
                message: "User successfully registered",
                code: "success_register",
            };
        });
    }
    signInUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const secretKey = process.env.JWT_SECRET;
            const { email, password: passwordRequest } = body;
            if (!email || !passwordRequest) {
                this.setStatus(400);
                return {
                    message: "Email and password are required",
                    code: "email_and_password_required",
                };
            }
            const user = yield user_model_1.default.findOne({
                where: { email },
            });
            if (user) {
                const passwordValid = bcrypt.compare(passwordRequest, user.password);
                if (!passwordValid) {
                    this.setStatus(401);
                    return {
                        message: "Incorrect email and password combination",
                        code: "error_signIn_combination",
                    };
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id }, secretKey !== null && secretKey !== void 0 ? secretKey : "", {
                    expiresIn: "2h",
                });
                const refreshToken = yield authtoken_model_1.default.createToken(user);
                this.setStatus(200);
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    accessToken: token,
                    refreshToken,
                };
            }
            else {
                this.setStatus(404);
                return {
                    message: "User not found",
                    code: "user_not_found",
                };
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
                const refreshToken = yield authtoken_model_1.default.findOne({
                    where: { token: requestToken },
                });
                if (!refreshToken) {
                    return errorResponse(404, {
                        message: "Invalid refresh token",
                        code: "invalid_refresh_token",
                    });
                }
                const isExpired = yield authtoken_model_1.default.verifyAndDeleteExpiredToken(refreshToken);
                if (isExpired) {
                    return errorResponse(403, {
                        message: "Refresh token was expired. Please make a new sign in request",
                        code: "expired_refresh_token",
                    });
                }
                const user = yield user_model_1.default.findOne({
                    where: { id: refreshToken.user },
                    attributes: { exclude: ["password"] },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "", {
                    expiresIn: process.env.JWT_EXPIRATION || "24h",
                });
                const newRefreshToken = yield authtoken_model_1.default.createToken(user);
                yield authtoken_model_1.default.destroy({ where: { id: refreshToken.id } });
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
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.Post)("signup"),
    __param(0, (0, tsoa_1.Body)())
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, tsoa_1.Post)("signin"),
    __param(0, (0, tsoa_1.Body)())
], AuthController.prototype, "signInUser", null);
__decorate([
    (0, tsoa_1.Post)("refresh-token"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)())
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)("auth")
], AuthController);
