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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const catchError = (err, res) => {
    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        return res
            .status(401)
            .send({ message: "Unauthorized! Access Token expired!" });
    }
    return res.status(401).send({ message: "Unauthorized!" });
};
const verifyToken = (req, res, next) => {
    let authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
        return res
            .status(403)
            .send({ message: "No token provided!", code: "no_token_provided" });
    }
    if (authorizationHeader.startsWith("Bearer ")) {
        authorizationHeader = authorizationHeader.slice(7, authorizationHeader.length);
    }
    else {
        return res
            .status(403)
            .send({ message: "No token provided!", code: "no_token_provided" });
    }
    const token = authorizationHeader;
    const secretKey = process.env.JWT_SECRET;
    jsonwebtoken_1.default.verify(token, secretKey !== null && secretKey !== void 0 ? secretKey : "", (err, decoded) => {
        if (err) {
            console.log(err);
            return catchError(err, res);
        }
        if (req && req) {
            req.user = decoded;
        }
        next();
    });
};
exports.verifyToken = verifyToken;
const getToken = (headers) => {
    let authorizationHeader = headers["authorization"];
    if (authorizationHeader) {
        return authorizationHeader.slice(7, authorizationHeader.length);
    }
};
exports.getToken = getToken;
