"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const v1_1 = require("./v1");
const router = express_1.Router();
router.use('/v1', v1_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map