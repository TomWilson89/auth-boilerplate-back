"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("../../middlewares/async");
class UserControllerClass {
    constructor() {
        this.me = async_1.default(async (req, res, next) => {
            res.json({ data: req.user });
        });
    }
}
const UserController = new UserControllerClass();
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map