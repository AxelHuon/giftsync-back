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
exports.validationBodyMiddleware = validationBodyMiddleware;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function validationBodyMiddleware(type) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const dto = (0, class_transformer_1.plainToInstance)(type, req.body);
        try {
            yield (0, class_validator_1.validateOrReject)(dto);
            next();
        }
        catch (errors) {
            return res.status(422).json({
                message: "Validation Failed",
                code: "validation_failed",
                errors: errors,
            });
        }
    });
}
