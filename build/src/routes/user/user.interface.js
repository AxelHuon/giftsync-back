"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserClassEditPasswordResponse = exports.UserClassEditPasswordRequest = exports.UserClassEditRequest = void 0;
const class_validator_1 = require("class-validator");
class UserClassEditRequest {
}
exports.UserClassEditRequest = UserClassEditRequest;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], UserClassEditRequest.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], UserClassEditRequest.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: "Invalid date format for birthDay" }),
    (0, class_validator_1.IsNotEmpty)()
], UserClassEditRequest.prototype, "dateOfBirth", void 0);
class UserClassEditPasswordRequest {
}
exports.UserClassEditPasswordRequest = UserClassEditPasswordRequest;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], UserClassEditPasswordRequest.prototype, "oldPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], UserClassEditPasswordRequest.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
], UserClassEditPasswordRequest.prototype, "confirmPassword", void 0);
class UserClassEditPasswordResponse {
}
exports.UserClassEditPasswordResponse = UserClassEditPasswordResponse;
