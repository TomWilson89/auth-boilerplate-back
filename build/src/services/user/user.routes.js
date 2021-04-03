"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorize_1 = require("../../middlewares/authorize");
const user_controller_1 = require("./user.controller");
const router = express_1.Router();
router.get('/me', authorize_1.authorize, user_controller_1.default.me);
exports.default = router;
//# sourceMappingURL=user.routes.js.map