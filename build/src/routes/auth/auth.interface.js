"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordRequest = exports.ForgotPasswordRequest = exports.RefreshTokenRequest = exports.SignInUserRequest = exports.RegisterUserRequest = void 0;
const class_validator_1 = require("class-validator");
class RegisterUserRequest {
}
exports.RegisterUserRequest = RegisterUserRequest;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email format" })
], RegisterUserRequest.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "First name must be a string" }),
    (0, class_validator_1.Matches)(/^[a-zA-Z]+$/, { message: "First name must contain only letters" }),
    (0, class_validator_1.MaxLength)(50, { message: "First name must be at most 50 characters long" })
], RegisterUserRequest.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Last name must be a string" }),
    (0, class_validator_1.MaxLength)(50, { message: "Last name must be at most 50 characters long" }),
    (0, class_validator_1.Matches)(/^[a-zA-Z]+$/, { message: "Last name must contain only letters" })
], RegisterUserRequest.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters long" }),
    (0, class_validator_1.MaxLength)(50, { message: "Password must be at most 50 characters long" }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    })
], RegisterUserRequest.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: "Invalid date format for birthDay" })
], RegisterUserRequest.prototype, "dateOfBirth", void 0);
class SignInUserRequest {
}
exports.SignInUserRequest = SignInUserRequest;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email format" })
], SignInUserRequest.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)()
], SignInUserRequest.prototype, "password", void 0);
class RefreshTokenRequest {
}
exports.RefreshTokenRequest = RefreshTokenRequest;
__decorate([
    (0, class_validator_1.IsString)()
], RefreshTokenRequest.prototype, "refreshToken", void 0);
class ForgotPasswordRequest {
}
exports.ForgotPasswordRequest = ForgotPasswordRequest;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email format" })
], ForgotPasswordRequest.prototype, "email", void 0);
class ResetPasswordRequest {
}
exports.ResetPasswordRequest = ResetPasswordRequest;
__decorate([
    (0, class_validator_1.IsString)()
], ResetPasswordRequest.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters long" }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    })
], ResetPasswordRequest.prototype, "newPassword", void 0);
