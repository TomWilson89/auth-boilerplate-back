"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const jwt = require("jsonwebtoken");
const async_1 = require("./async");
const http_1 = require("../errors/http");
const config_1 = require("../config");
const user_model_1 = require("../services/user/user.model");
exports.authorize = async_1.default(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new http_1.default('NotAuthorized', 401));
    }
    try {
        const decoded = jwt.verify(token, config_1.default.jwt.SECRET);
        console.log(`decoded`, decoded);
        const user = await user_model_1.default.findById(decoded.id);
        req.user = user;
    }
    catch (error) {
        console.log(`error`, error);
        return next(new http_1.default('InvalidToken', 401));
    }
    next();
});
//# sourceMappingURL=authorize.js.map