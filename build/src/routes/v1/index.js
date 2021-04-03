"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../../services/auth/auth.routes");
const user_routes_1 = require("../../services/user/user.routes");
const router = express_1.Router();
router.use('/auth', auth_routes_1.default);
router.use('/user', user_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map