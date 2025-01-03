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
const secret_santa_controller_1 = require("./../src/routes/secret-santa/secret-santa.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const room_controller_1 = require("./../src/routes/room/room.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const auth_controller_1 = require("./../src/routes/auth/auth.controller");
const multer = require('multer');
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "UserClassGetResponse": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "dateOfBirth": { "dataType": "datetime", "required": true },
            "profilePicture": { "dataType": "string" },
            "createdAt": { "dataType": "datetime" },
            "updatedAt": { "dataType": "datetime" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserClassEditResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserClassEditPasswordResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserClassEditPasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "oldPassword": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "confirmPassword": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserCollectionGetUserOfRoom": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "profilePicture": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetRoomElement": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "ownerId": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "slug": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "datetime" },
            "updatedAt": { "dataType": "datetime" },
            "users": { "dataType": "array", "array": { "dataType": "refObject", "ref": "UserCollectionGetUserOfRoom" }, "required": true },
            "isOwner": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetRoomOfUserResponse": {
        "dataType": "refObject",
        "properties": {
            "rooms": { "dataType": "array", "array": { "dataType": "refObject", "ref": "GetRoomElement" }, "required": true },
            "total": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SecretSantaResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "code": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserSecretSanta": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SecretSantaRequest": {
        "dataType": "refObject",
        "properties": {
            "maxPrice": { "dataType": "double", "required": true },
            "users": { "dataType": "array", "array": { "dataType": "refObject", "ref": "UserSecretSanta" }, "required": true },
            "title": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoomAttributes": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "ownerId": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "slug": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "datetime" },
            "updatedAt": { "dataType": "datetime" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRoomRequest": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string", "required": true },
            "emails": { "dataType": "array", "array": { "dataType": "string" } },
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
            "emails": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "roomId": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JoinRoomResponse": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
            "roomSlug": { "dataType": "string", "required": true },
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
    "EditRoomRequest": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterUserResponse": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "dateOfBirth": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "profilePicture": { "dataType": "string" },
            "id": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "updatedAt": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
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
    "SignInUserResponse": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "accessToken": { "dataType": "string", "required": true },
            "refreshToken": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "profilePicture": { "dataType": "string" },
            "dateOfBirth": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }] },
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
    "SignInWithGoogleRequest": {
        "dataType": "refObject",
        "properties": {
            "idToken": { "dataType": "string", "required": true },
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
function RegisterRoutes(app, opts) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const upload = (opts === null || opts === void 0 ? void 0 : opts.multer) || multer({ "limits": { "fileSize": 8388608 } });
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
    app.patch('/api/user/:userId', upload.fields([{ "name": "profilePicture", "maxCount": 1, "multiple": false }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.patchUser)), function UserController_patchUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                firstName: { "in": "formData", "name": "firstName", "dataType": "string" },
                lastName: { "in": "formData", "name": "lastName", "dataType": "string" },
                dateOfBirth: { "in": "formData", "name": "dateOfBirth", "dataType": "string" },
                profilePicture: { "in": "formData", "name": "profilePicture", "dataType": "file" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'patchUser',
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
    app.patch('/api/user/:userId/edit-password', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.patchPassword)), function UserController_patchPassword(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                body: { "in": "body", "name": "body", "required": true, "ref": "UserClassEditPasswordRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'patchPassword',
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
    app.get('/api/user/:userId/rooms', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getRoomsOfUser)), function UserController_getRoomsOfUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
                queryString: { "in": "query", "name": "queryString", "dataType": "string" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getRoomsOfUser',
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
    app.post('/api/secret-santa', ...((0, runtime_1.fetchMiddlewares)(secret_santa_controller_1.SecretSantaController)), ...((0, runtime_1.fetchMiddlewares)(secret_santa_controller_1.SecretSantaController.prototype.postSecretSanta)), function SecretSantaController_postSecretSanta(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "SecretSantaRequest" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new secret_santa_controller_1.SecretSantaController();
                yield templateService.apiHandler({
                    methodName: 'postSecretSanta',
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
    app.post('/api/room/invite-users', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.inviteUsersToARoom)), function RoomController_inviteUsersToARoom(request, response, next) {
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
                    methodName: 'inviteUsersToARoom',
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
    app.delete('/api/room/:roomId/delete', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.deleteRoom)), function RoomController_deleteRoom(request, response, next) {
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
    app.put('/api/room/:roomId/update', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.putRoom)), function RoomController_putRoom(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                roomId: { "in": "path", "name": "roomId", "required": true, "dataType": "string" },
                body: { "in": "body", "name": "body", "required": true, "ref": "EditRoomRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new room_controller_1.RoomController();
                yield templateService.apiHandler({
                    methodName: 'putRoom',
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
    app.delete('/api/room/:roomId/user/:userId', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.deleteUserFromARoom)), function RoomController_deleteUserFromARoom(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                roomId: { "in": "path", "name": "roomId", "required": true, "dataType": "string" },
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new room_controller_1.RoomController();
                yield templateService.apiHandler({
                    methodName: 'deleteUserFromARoom',
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
    app.get('/api/room/:roomSlug', ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController)), ...((0, runtime_1.fetchMiddlewares)(room_controller_1.RoomController.prototype.getRoomBySlug)), function RoomController_getRoomBySlug(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                roomSlug: { "in": "path", "name": "roomSlug", "required": true, "dataType": "string" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new room_controller_1.RoomController();
                yield templateService.apiHandler({
                    methodName: 'getRoomBySlug',
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
    app.post('/api/auth/signin-google', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.signInUserWithGoogle)), function AuthController_signInUserWithGoogle(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "SignInWithGoogleRequest" },
                errorResponse: { "in": "res", "name": "500", "required": true, "ref": "ErrorResponse" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new auth_controller_1.AuthController();
                yield templateService.apiHandler({
                    methodName: 'signInUserWithGoogle',
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
