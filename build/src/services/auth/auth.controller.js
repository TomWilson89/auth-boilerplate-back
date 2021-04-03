"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios_1 = require("axios");
const google_auth_library_1 = require("google-auth-library");
const async_1 = require("../../middlewares/async");
const user_model_1 = require("../user/user.model");
const http_1 = require("../../errors/http");
const config_1 = require("../../config");
const mail_1 = require("../../utils/mail");
const controllers_1 = require("../../utils/controllers");
const internalServer_1 = require("../../errors/internalServer");
class AuthControllerClass {
    constructor() {
        this.validParams = ['email', 'name', 'password'];
        this.client = new google_auth_library_1.OAuth2Client(config_1.default.google.CLIENT_ID);
        this.sendToken = (user, status, res) => {
            const token = user.getToken();
            res.status(status).json({ data: token });
        };
        this.create = async_1.default(async (req, res, next) => {
            const { name, email, password } = req.body;
            const user = await user_model_1.default.findOne({ email });
            if (user)
                return next(new http_1.default('UserAlreadyExists', 422));
            const token = jwt.sign({ email, name, password }, config_1.default.jwt.activation.SECRET, {
                expiresIn: config_1.default.jwt.activation.EXPIRES,
            });
            try {
                await mail_1.default.activation(email, {
                    subject: 'Activate your Account',
                    link: `${config_1.default.client.URL}/activate/${token}`,
                }, res);
            }
            catch (err) {
                console.error('Error ocurred while sending mail: ', err);
            }
        });
        this.accountActivation = async_1.default(async (req, res, next) => {
            const { token } = req.body;
            if (token) {
                const decoded = jwt.verify(token, config_1.default.jwt.activation.SECRET);
                const { name, email, password } = decoded;
                const body = { name, email, password };
                const user = new user_model_1.default(controllers_1.buildParams(this.validParams, body));
                await user.save();
                this.sendToken(user, 201, res);
            }
            else {
                next(new internalServer_1.default());
            }
        });
        this.login = async (req, res, next) => {
            const { email, password } = req.body;
            const user = await user_model_1.default.findOne({ email }).select('+password');
            if (!user) {
                return next(new http_1.default('InvalidCredentials', 401));
            }
            if (!(await user.matchPassword(password))) {
                return next(new http_1.default('InvalidCredentials', 401));
            }
            this.sendToken(user, 200, res);
        };
        this.googleLogin = async_1.default(async (req, res, next) => {
            const { idToken } = req.body;
            try {
                const response = await this.client.verifyIdToken({
                    idToken,
                    audience: config_1.default.google.CLIENT_ID,
                });
                const { email, email_verified, name } = response.getPayload();
                if (email_verified) {
                    const user = await user_model_1.default.findOne({ email });
                    if (user) {
                        return this.sendToken(user, 200, res);
                    }
                    else {
                        let password = await crypto.randomBytes(48).toString('hex');
                        const newUser = new user_model_1.default(controllers_1.buildParams(this.validParams, { email, name, password }));
                        await newUser.save();
                        return this.sendToken(newUser, 201, res);
                    }
                }
                else {
                    return next(new internalServer_1.default());
                }
            }
            catch (error) {
                console.error('error', error);
                return next(new internalServer_1.default());
            }
        });
        this.facebookLogin = async_1.default(async (req, res, next) => {
            const { userID, accessToken } = req.body;
            const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
            try {
                const { data: { name, email }, } = await axios_1.default.get(url);
                const user = await user_model_1.default.findOne({ email });
                if (user) {
                    return this.sendToken(user, 200, res);
                }
                else {
                    let password = await crypto.randomBytes(48).toString('hex');
                    const newUser = new user_model_1.default(controllers_1.buildParams(this.validParams, { email, name, password }));
                    await newUser.save();
                    return this.sendToken(newUser, 201, res);
                }
            }
            catch (error) {
                console.error('error', error);
                return next(new internalServer_1.default());
            }
        });
        this.forgotPassword = async_1.default(async (req, res, next) => {
            const { email } = req.body;
            const user = await user_model_1.default.findOne({ email });
            if (!user) {
                return next(new http_1.default('UserDoNotExists', 422));
            }
            const resetToken = user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false, validateModifiedOnly: true });
            const resetUrl = `${config_1.default.client.URL}/reset/${resetToken}`;
            try {
                await mail_1.default.forgotPassword(email, { link: resetUrl, subject: 'Forgot password' }, res);
            }
            catch (error) {
                console.error('Error ocurred while sending mail: ', error);
            }
        });
        this.resetPassword = async_1.default(async (req, res, next) => {
            const { token } = req.body;
            const resetPasswordToken = crypto
                .createHash(config_1.default.crypto.ALGORITHM)
                .update(token)
                .digest('hex');
            const user = await user_model_1.default.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: new Date(Date.now()) },
            });
            if (!user) {
                return next(new http_1.default('InvalidToken', 422));
            }
            user.password = req.body.password;
            user.resetPasswordExpire = undefined;
            user.resetPasswordToken = undefined;
            await user.save();
            this.sendToken(user, 200, res);
        });
    }
}
exports.AuthController = new AuthControllerClass();
exports.default = exports.AuthController;
//# sourceMappingURL=auth.controller.js.map