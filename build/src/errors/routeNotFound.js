"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
class RouteNotFound extends http_1.default {
    constructor(params = {}) {
        super('RouteNotFound', 404, params);
    }
}
exports.default = RouteNotFound;
//# sourceMappingURL=routeNotFound.js.map