"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importStar(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = require("../build/routes");
const apikey_middleware_1 = require("./middleware/apikey.middleware");
const cors = require("cors");
exports.app = (0, express_1.default)();
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Trop de requêtes effectuées depuis cette IP, veuillez réessayer après 15 minutes.",
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
exports.app.use(cors());
exports.app.use("/api", apikey_middleware_1.apiKeyMiddleware, apiLimiter);
exports.app.use((0, express_1.urlencoded)({
    extended: true,
}));
exports.app.use((0, express_1.json)());
(0, routes_1.RegisterRoutes)(exports.app);
