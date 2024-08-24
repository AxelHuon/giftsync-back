"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const getToken = (headers) => {
    let authorizationHeader = headers["authorization"];
    if (authorizationHeader) {
        return authorizationHeader.slice(7, authorizationHeader.length);
    }
};
exports.getToken = getToken;
