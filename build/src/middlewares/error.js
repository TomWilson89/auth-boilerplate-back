"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = require("jsonwebtoken");
const http_1 = require("../errors/http");
const internalServer_1 = require("../errors/internalServer");
const utils_1 = require("../utils");
const error = (err, req, res, next) => {
    let errors;
    if (process.env.NODE_ENV !== 'test') {
        console.error('REQUESTED_ENDPOINT', req.originalUrl, '\n', 'ERROR_HANDLED', err);
    }
    if (err instanceof Array) {
        errors = err;
    }
    else if (err instanceof http_1.default) {
        errors = [err];
    }
    else if (err instanceof mongodb_1.MongoError) {
        if (err.code === 11000) {
            const field = utils_1.Utils.capitalizeEach(err.message.split('index:')[1].split('dup key')[0].split('_')[0]);
            errors = [new http_1.default('DuplicatedField', 422, { field })];
        }
        else {
            errors = [new internalServer_1.default()];
        }
    }
    else if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        errors = [new http_1.default('TokenExpired', 422)];
    }
    else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        errors = [new http_1.default('InvalidToken', 422)];
    }
    else {
        console.error('Error without handler', err);
        errors = [new internalServer_1.default()];
    }
    const error = errors[0];
    res.status(error.status).json({
        error: {
            errors,
            code: error.status,
            messages: error.message,
        },
    });
};
exports.default = error;
//# sourceMappingURL=error.js.map