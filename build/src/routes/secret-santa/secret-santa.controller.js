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
exports.SecretSantaController = void 0;
const tsoa_1 = require("tsoa");
const mailConfig_1 = __importDefault(require("../../mailConfig/mailConfig"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const secret_santa_interface_1 = require("./secret-santa.interface");
require("dotenv").config();
let SecretSantaController = class SecretSantaController extends tsoa_1.Controller {
    postSecretSanta(body, req, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = body.users;
                if (users.length < 2) {
                    return errorResponse(400, {
                        message: "Il faut au moins deux participants pour le Secret Santa.",
                        code: "invalid_participant_count",
                    });
                }
                yield this.assignSecretSanta(users, body.maxPrice);
                return {
                    message: "Secret Santa request has been created and emails sent",
                    code: 200,
                };
            }
            catch (err) {
                console.error(err);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    sendEmail(to, subject, text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mailConfig_1.default.sendMail({
                from: "contact@axelhuon.fr",
                to,
                subject,
                text,
            });
        });
    }
    shuffleUsers(users) {
        return [...users].sort(() => Math.random() - 0.5);
    }
    assignSecretSanta(users, maxPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const shuffled = this.shuffleUsers(users);
            for (let i = 0; i < shuffled.length; i++) {
                const giver = shuffled[i];
                const receiver = shuffled[(i + 1) % shuffled.length];
                console.log(`Giver: ${giver.name} - Receiver: ${receiver.name}`);
                yield this.sendEmail(giver.email, "Votre assignation Secret Santa", `Bonjour ${giver.name}, vous devez offrir un cadeau à ${receiver.name} pour le Secret Santa. Le prix maximum est de ${maxPrice}€.`);
            }
        });
    }
};
exports.SecretSantaController = SecretSantaController;
__decorate([
    (0, tsoa_1.Post)(),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(secret_santa_interface_1.SecretSantaRequest)]),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Res)())
], SecretSantaController.prototype, "postSecretSanta", null);
exports.SecretSantaController = SecretSantaController = __decorate([
    (0, tsoa_1.Tags)("Secret Santa"),
    (0, tsoa_1.Route)("secret-santa")
], SecretSantaController);
