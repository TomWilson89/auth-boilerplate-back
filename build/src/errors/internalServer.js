"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
class InternalServerError extends http_1.default {
    constructor() {
        super('InternalServer', 500);
    }
}
exports.default = InternalServerError;
//# sourceMappingURL=internalServer.js.map