"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const crypto = require("crypto");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const mongoose_1 = require("mongoose");
const config_1 = require("../../config");
const roles_model_1 = require("../roles/roles.model");
const roles_interface_1 = require("../roles/roles.interface");
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'FieldIsRequired'],
        max: [32, 'FieldIsNotValid'],
        min: [2, 'FieldIsNotValid'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'FieldIsRequired'],
        max: [32, 'FieldIsNotValid'],
        min: [2, 'FieldIsNotValid'],
        unique: true,
        lowercase: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'FieldIsNotValid',
        ],
    },
    password: {
        type: String,
        required: [true, 'FieldIsRequired'],
        max: [20, 'FieldIsTooLong'],
        min: [6, 'FieldIsTooShort'],
        select: false,
    },
    role: {
        type: Number,
        enum: roles_model_1.default.find(),
        required: [true, 'FieldIsRequired'],
        default: roles_interface_1.Role.USER,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    deletedAt: {
        type: Date,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
schema.index({ email: 1 });
schema.pre('save', async function (next) {
    if (this.isNew) {
        this.createdAt = new Date();
    }
    if (this.isModified('password') || this.isNew) {
        this.password = await argon2.hash(this.password, {
            parallelism: Number(config_1.default.argon.ARGON_PARALLELISM),
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            hashLength: Number(config_1.default.argon.ARGON_LENGTH),
            timeCost: Number(config_1.default.argon.ARGON_TIME_COST),
        });
    }
    next();
});
schema.methods.getToken = function () {
    return jwt.sign({ id: this._id }, config_1.default.jwt.SECRET, {
        expiresIn: config_1.default.jwt.EXPIRES,
    });
};
schema.methods.matchPassword = async function (password) {
    return await argon2.verify(this.password, password);
};
schema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash(config_1.default.crypto.ALGORITHM)
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
};
exports.User = mongoose_1.model('User', schema);
exports.default = exports.User;
//# sourceMappingURL=user.model.js.map