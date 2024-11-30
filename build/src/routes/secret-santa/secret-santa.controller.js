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
exports.SecretSantaController = void 0;
const tsoa_1 = require("tsoa");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const mail_1 = require("../../utils/mail");
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
                yield this.assignSecretSanta(users, body.maxPrice, body.title);
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
    shuffleUsers(users) {
        return [...users].sort(() => Math.random() - 0.5);
    }
    generateEmailContent(giver, receiver, maxPrice, title) {
        return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Secret Santa - ${title}</title>
    </head>
    <body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA; color: #1F1F1F;">
        <div style="text-align: center; padding-top: 20px; padding-bottom: 20px;">
            <img src="https://www.giftsync.fr/images/gslogo.png" alt="Logo" style="width: 200px; max-width: 100%; height: auto; margin-bottom: 20px;">
            <h1 style="color: #4747FF; margin: 0; font-size: 24px; font-weight: bold;">${title} - Secret Santa</h1>
        </div>
        <div style="text-align: center; padding-top: 20px;">
            <p style="margin-bottom: 15px;">Bonjour <strong style="font-weight: bold;">${giver.name}</strong>,</p>
            <p style="margin-bottom: 15px;">Vous avez été choisi pour offrir un cadeau à <strong style="font-weight: bold;">${receiver.name}</strong> pour le Secret Santa.</p>
            <p style="margin-bottom: 15px;">Le prix maximum du cadeau est fixé à <strong style="font-weight: bold;">${maxPrice}€</strong>.</p>
            <p style="margin-bottom: 15px;">Joyeuses fêtes et amusez-vous bien !</p>
        </div>
    </body>
    </html>
  `;
    }
    assignSecretSanta(users, maxPrice, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const shuffled = this.shuffleUsers(users);
            for (let i = 0; i < shuffled.length; i++) {
                const giver = shuffled[i];
                const receiver = shuffled[(i + 1) % shuffled.length];
                console.log(`Giver: ${giver.name} - Receiver: ${receiver.name}`);
                const htmlContent = this.generateEmailContent(giver, receiver, maxPrice, title);
                yield (0, mail_1.sendEmail)(giver.email, "Secret Santa - " + title, htmlContent);
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
