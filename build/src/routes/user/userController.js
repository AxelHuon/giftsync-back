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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsoa_1 = require("tsoa");
const auth_middleware_1 = require("../../middleware/auth.middleware");
let UserController = class UserController extends tsoa_1.Controller {
    getMe(req, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers["authorization"]);
                return {
                    id: "req.user.id",
                    email: "req.user.email",
                    firstName: "req.user.username",
                    lastName: "req.user.username",
                    birthDay: "req.user.birthDay",
                };
            }
            catch (err) { }
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Get)("get-me"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Res)())
], UserController.prototype, "getMe", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Route)("user")
], UserController);
