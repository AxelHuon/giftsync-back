"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRoomRequest = exports.InviteUserRequest = exports.EditRoomRequest = exports.CreateRoomRequest = void 0;
const class_validator_1 = require("class-validator");
class CreateRoomRequest {
}
exports.CreateRoomRequest = CreateRoomRequest;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3)
], CreateRoomRequest.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true })
], CreateRoomRequest.prototype, "emails", void 0);
class EditRoomRequest {
}
exports.EditRoomRequest = EditRoomRequest;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3)
], EditRoomRequest.prototype, "title", void 0);
class InviteUserRequest {
}
exports.InviteUserRequest = InviteUserRequest;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true })
], InviteUserRequest.prototype, "emails", void 0);
__decorate([
    (0, class_validator_1.IsString)()
], InviteUserRequest.prototype, "roomId", void 0);
class JoinRoomRequest {
}
exports.JoinRoomRequest = JoinRoomRequest;
__decorate([
    (0, class_validator_1.IsEmail)()
], JoinRoomRequest.prototype, "email", void 0);
