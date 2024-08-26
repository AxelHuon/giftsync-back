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
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app_1 = require("./app");
const connection_1 = __importDefault(require("./config/connection"));
require("dotenv/config");
require("./models/associations"); // Importer les associations après les modèles
const port = process.env.PORT || 3001;
const swaggerDocument = require("../swagger.json");
app_1.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app_1.app.get("/swagger-json", (req, res) => {
    const swaggerFilePath = path.join(__dirname, "../swagger.json");
    fs.readFile(swaggerFilePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Erreur lors de la lecture du fichier Swagger JSON");
        }
        else {
            res.header("Content-Type", "application/json");
            res.send(data);
        }
    });
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.default.sync();
        app_1.app.listen(port, () => {
            console.log(`app started on port ${port}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
void start();
