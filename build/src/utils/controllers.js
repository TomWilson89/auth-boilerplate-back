"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildParams = void 0;
function buildParams(validParams, body) {
    const params = {};
    validParams.forEach((attr) => {
        if (body[attr] !== undefined) {
            params[attr] = body[attr];
        }
    });
    return params;
}
exports.buildParams = buildParams;
//# sourceMappingURL=controllers.js.map