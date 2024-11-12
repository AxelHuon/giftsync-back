"use strict";
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
exports.RegisterRoutes = RegisterRoutes;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const user_controller_1 = require("./../src/routes/user/user.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const room_controller_1 = require("./../src/routes/room/room.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const auth_controller_1 = require("./../src/routes/auth/auth.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserClassGetResponse": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "dateOfBirth": { "dataType": "datetime", "required": true },
            "createdAt": { "dataType": "datetime" },
            "updatedAt": { "dataType": "datetime" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterUserRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "dateOfBirth": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoomAttributes": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "ownerId": { "dataType": "string", "required": true },
            "slug": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRoomRequest": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InviteUserResponse": {
        "dataType": "refObject",
        "properties": {
            "roomInviteToken": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InviteUserRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "roomId": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JoinRoomResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "roomId": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JoinRoomRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterUserResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignInUserResponse": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "accessToken": { "dataType": "string", "required": true },
            "refreshToken": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "dateOfBirth": { "dataType": "datetime", "required": true },
            "email": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignInUserRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RefreshTokenResponse": {
        "dataType": "refObject",
        "properties": {
            "accessToken": { "dataType": "string", "required": true },
            "refreshToken": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RefreshTokenRequest": {
        "dataType": "refObject",
        "properties": {
            "refreshToken": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ForgotPasswordResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ForgotPasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResetPasswordResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResetPasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "token": { "dataType": "string", "required": true },
            "newPassword": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get('/api/user/:userId/rooms', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getRoomOfAUser)), function UserController_getRoomOfAUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getRoomOfAUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/user/:userId', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getUserById)), function UserController_getUserById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getUserById',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch('/api/user/:userId', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.postUserInformations)), function UserController_postUserInformations(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                body: { "in": "body", "name": "body", "required": true, "ref": "RegisterUserRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'postUserInformations',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/room/create', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.createRoom)), function RoomController_createRoom(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                body: { "in": "body", "name": "body", "required": true, "ref": "CreateRoomRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new room_controller_1.RoomController();
                yield templateService.apiHandler({
                    methodName: 'createRoom',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/room/invite-user', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.inviteUser)), function RoomController_inviteUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                body: { "in": "body", "name": "body", "required": true, "ref": "InviteUserRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new room_controller_1.RoomController();
                yield templateService.apiHandler({
                    methodName: 'inviteUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/room/join/:token', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.joinRoom)), function RoomController_joinRoom(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                token: { "in": "path", "name": "token", "required": true, "dataType": "string" },
                body: { "in": "body", "name": "body", "required": true, "ref": "JoinRoomRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new room_controller_1.RoomController();
                yield templateService.apiHandler({
                    methodName: 'joinRoom',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/room/delete/:roomId', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.deleteRoom)), function RoomController_deleteRoom(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                roomId: { "in": "path", "name": "roomId", "required": true, "dataType": "string" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new room_controller_1.RoomController();
                yield templateService.apiHandler({
                    methodName: 'deleteRoom',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/room/update/:roomId', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.updateRoom)), function RoomController_updateRoom(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                roomId: { "in": "path", "name": "roomId", "required": true, "dataType": "string" },
                body: { "in": "body", "name": "body", "required": true, "ref": "CreateRoomRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new room_controller_1.RoomController();
                yield templateService.apiHandler({
                    methodName: 'updateRoom',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/room/:roomId', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.getRoomById)), function RoomController_getRoomById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                roomId: { "in": "path", "name": "roomId", "required": true, "dataType": "string" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new room_controller_1.RoomController();
                yield templateService.apiHandler({
                    methodName: 'getRoomById',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/auth/signup', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.registerUser)), function AuthController_registerUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "RegisterUserRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'registerUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/auth/signin', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.signInUser)), function AuthController_signInUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "SignInUserRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'signInUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/auth/refresh-token', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.refreshToken)), function AuthController_refreshToken(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "RefreshTokenRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'refreshToken',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/auth/forgot-password', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.forgotPassword)), function AuthController_forgotPassword(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "ForgotPasswordRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'forgotPassword',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/auth/reset-password', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.resetPassword)), function AuthController_resetPassword(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "ResetPasswordRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'resetPassword',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
