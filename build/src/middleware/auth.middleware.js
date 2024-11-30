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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = getToken;
exports.jwtVerify = jwtVerify;
exports.securityMiddleware = securityMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getToken(headers) {
    const authorizationHeader = headers["authorization"];
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
        return authorizationHeader.substring(7, authorizationHeader.length);
    }
    return null;
}
function jwtVerify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!token)
                return {
                    message: "Token missing",
                    code: "token_missing",
                };
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            if (typeof decodedToken !== "object" || !("id" in decodedToken)) {
                return {
                    message: "Invalid token",
                    code: "token_invalid",
                };
            }
            /*    const tokenExists = await AuthtokenModel.findOne({
              where: { user: decodedToken.id },
            });*/
            const tokenExists = true;
            if (!tokenExists) {
                return {
                    message: "Invalid token",
                    code: "token_invalid",
                };
            }
            return decodedToken;
        }
        catch (e) {
            if (e.message === "jwt expired") {
                return {
                    message: "Token expired",
                    code: "token_expired",
                };
            }
            return {
                message: "Invalid token",
                code: "token_invalid",
            };
        }
    });
}
function securityMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = getToken(req.headers);
        if (!token) {
            return res
                .status(401)
                .send({ message: "Unauthorized", code: "token_missing" });
        }
        const decodedToken = yield jwtVerify(token);
        if ("code" in decodedToken) {
            return res.status(401).send(decodedToken);
        }
        next();
    });
}
