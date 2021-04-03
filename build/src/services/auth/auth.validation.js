"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const isEmail_1 = require("validator/lib/isEmail");
const http_1 = require("../../errors/http");
class AuthValidationClass {
    constructor() {
        this.create = (req, res, next) => {
            const { body } = req;
            const errors = [];
            if (!body.email)
                errors.push(new http_1.default('FieldIsRequired', 422, { field: 'email' }));
            if (body.email && !isEmail_1.default(body.email)) {
                errors.push(new http_1.default('FieldIsNotValid', 422, { field: 'email' }));
            }
            if (!body.password)
                errors.push(new http_1.default('FieldIsRequired', 422, { field: 'password' }));
            if (body.password && body.password.length < 6) {
                errors.push(new http_1.default('FieldIsTooShort', 422, { field: 'password', limit: '6' }));
            }
            if (body.password && body.password.length > 20) {
                errors.push(new http_1.default('FieldIsTooLong', 422, { field: 'password', limit: '20' }));
            }
            if (!body.name)
                errors.push(new http_1.default('FieldIsRequired', 422, { field: 'name' }));
            if (body.name && body.name.length < 2) {
                errors.push(new http_1.default('FieldIsTooShort', 422, { field: 'name', limit: '2' }));
            }
            if (body.name && body.name.length > 32) {
                errors.push(new http_1.default('FieldIsTooLong', 422, { field: 'name', limit: '32' }));
            }
            if (errors.length)
                next(errors);
            else
                next();
        };
        this.login = (req, res, next) => {
            const { body } = req;
            const errors = [];
            if (!body.email)
                errors.push(new http_1.default('FieldIsRequired', 422, { field: 'email' }));
            if (body.email && !isEmail_1.default(body.email)) {
                errors.push(new http_1.default('FieldIsNotValid', 422, { field: 'email' }));
            }
            if (!body.password)
                errors.push(new http_1.default('FieldIsRequired', 422, { field: 'password' }));
            if ((body.password && body.password.length < 6) ||
                (body.password && body.password.length > 20)) {
                errors.push(new http_1.default('FieldIsNotValid', 422, { field: 'password' }));
            }
            if (errors.length)
                next(errors);
            else
                next();
        };
        this.forgotPassword = (req, res, next) => {
            const { email } = req.body;
            const errors = [];
            if (!email)
                errors.push(new http_1.default('FieldIsRequired', 422, { field: 'email' }));
            if (email && !isEmail_1.default(email)) {
                errors.push(new http_1.default('FieldIsNotValid', 422, { field: 'email' }));
            }
            if (errors.length)
                next(errors);
            else
                next();
        };
        this.resetPassword = (req, res, next) => {
            const { token, password } = req.body;
            const errors = [];
            if (!token)
                errors.push(new http_1.default('FieldIsRequired', 422, { field: 'token' }));
            if (!password)
                errors.push(new http_1.default('FieldIsRequired', 422, { field: 'password' }));
            if (password && password.length < 6) {
                errors.push(new http_1.default('FieldIsTooShort', 422, { field: 'password', limit: '6' }));
            }
            if (password && password.length > 20) {
                errors.push(new http_1.default('FieldIsTooLong', 422, { field: 'password', limit: '20' }));
            }
            if (errors.length)
                next(errors);
            else
                next();
        };
    }
}
exports.AuthValidation = new AuthValidationClass();
exports.default = exports.AuthValidation;
//# sourceMappingURL=auth.validation.js.map