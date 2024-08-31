"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transport = void 0;
const node_process_1 = __importDefault(require("node:process"));
var nodemailer = require("nodemailer");
exports.transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "4e70b92624ec02",
        pass: node_process_1.default.env.PASSWORD_MAIL_TRAP,
    },
});
