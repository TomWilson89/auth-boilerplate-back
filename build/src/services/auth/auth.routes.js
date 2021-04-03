"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.Router();
router.route('/register').post(auth_validation_1.default.create, auth_controller_1.default.create);
router.route('/login').post(auth_validation_1.default.login, auth_controller_1.default.login);
router.route('/google-login').post(auth_controller_1.default.googleLogin);
router.route('/facebook-login').post(auth_controller_1.default.facebookLogin);
router.route('/activation').post(auth_controller_1.default.accountActivation);
router.route('/forgot-password').post(auth_validation_1.default.forgotPassword, auth_controller_1.default.forgotPassword);
router.route('/reset-password').post(auth_validation_1.default.resetPassword, auth_controller_1.default.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map