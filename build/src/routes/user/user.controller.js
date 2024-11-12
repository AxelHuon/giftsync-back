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
exports.UserController = void 0;
const tsoa_1 = require("tsoa");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const user_model_1 = __importDefault(require("../../models/user.model"));
const user_interface_1 = require("./user.interface");
require("dotenv").config();
let UserController = class UserController extends tsoa_1.Controller {
    getRoomOfAUser(req, userId, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({
                    where: { id: userId },
                    attributes: { exclude: ["password"] },
                });
                const rooms = yield (user === null || user === void 0 ? void 0 : user.getRooms());
                return rooms;
            }
            catch (err) {
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    getUserById(userId, req, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({
                    where: { id: userId },
                    attributes: { exclude: ["password"] },
                    include: ["rooms"],
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "User not found",
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
    /*Root to edit firstName lastName and dateOfBirth*/
    postUserInformations(userId, req, body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers);
                const decodedToken = yield (0, auth_middleware_1.jwtVerify)(token);
                if ("code" in decodedToken) {
                    return errorResponse(401, decodedToken);
                }
                if (decodedToken.id !== userId) {
                    return errorResponse(401, {
                        message: "Unauthorized",
                        code: "unauthorized",
                    });
                }
                const user = yield user_model_1.default.findOne({
                    where: { id: userId },
                    attributes: { exclude: ["password"] },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                /*get body data*/
                const { firstName, lastName, dateOfBirth } = body;
                /*update user data*/
                yield user.update({ firstName, lastName, dateOfBirth });
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
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Get)("{userId}/rooms"),
    (0, tsoa_1.Middlewares)([auth_middleware_1.securityMiddleware]),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Res)())
], UserController.prototype, "getRoomOfAUser", null);
__decorate([
    (0, tsoa_1.Get)("{userId}"),
    (0, tsoa_1.Middlewares)([auth_middleware_1.securityMiddleware]),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Res)())
], UserController.prototype, "getUserById", null);
__decorate([
    (0, tsoa_1.Patch)("{userId}"),
    (0, tsoa_1.Middlewares)([
        auth_middleware_1.securityMiddleware,
        (0, validation_middleware_1.validationBodyMiddleware)(user_interface_1.UserClassEditRequest),
    ]),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Body)()),
    __param(3, (0, tsoa_1.Res)())
], UserController.prototype, "postUserInformations", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Tags)("User"),
    (0, tsoa_1.Route)("user")
], UserController);
