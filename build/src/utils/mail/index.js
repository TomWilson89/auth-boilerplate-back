"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sgMail = require("@sendgrid/mail");
const config_1 = require("../../config");
sgMail.setApiKey(config_1.default.mail.API_KEY);
class Mailer {
    static async activation(email, data, res) {
        try {
            const options = {
                to: email,
                templateId: this.TEMPLATE_ID['accountActivation'],
                from: this.SENDER_EMAIL,
                dynamicTemplateData: data,
            };
            await sgMail.send(options);
            res.json({
                data: `Email sent to ${email}, please follow the instructions to acivate your account`,
            });
        }
        catch (error) {
            console.error('Error sending email: ', error.response.body);
            res.json({ data: 'An Error ocurred' });
        }
    }
    static async forgotPassword(email, data, res) {
        try {
            const options = {
                to: email,
                templateId: this.TEMPLATE_ID['forgotPassword'],
                from: this.SENDER_EMAIL,
                dynamicTemplateData: data,
            };
            await sgMail.send(options);
            res.json({
                data: `Email sent to ${email}, please follow the instructions to reset your password`,
            });
        }
        catch (error) {
            console.log('Error sending email: ', error.response.body);
            res.json({ data: 'An Error ocurred' });
        }
    }
}
Mailer.SENDER_EMAIL = { email: config_1.default.mail.SENDER, name: config_1.default.mail.NAME };
Mailer.TEMPLATE_ID = {
    accountActivation: 'd-646377c9fc9b47d3887bd3be1bb3acf9',
    forgotPassword: 'd-093bd7de6ddd4e668bb86a06b477dbb9',
};
exports.default = Mailer;
//# sourceMappingURL=index.js.map