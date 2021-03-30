import sgMail = require('@sendgrid/mail');
import config from '../../config';
import { Response } from 'express';

sgMail.setApiKey(config.mail.API_KEY);

class Mailer {
  private static SENDER_EMAIL = { email: config.mail.SENDER, name: config.mail.NAME };
  private static TEMPLATE_ID = {
    accountActivation: 'd-646377c9fc9b47d3887bd3be1bb3acf9',
    forgotPassword: 'd-093bd7de6ddd4e668bb86a06b477dbb9',
  };

  static async activation(email: string, data: any, res: Response) {
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
    } catch (error) {
      console.error('Error sending email: ', error.response.body);
      res.json({ data: 'An Error ocurred' });
    }
  }

  static async forgotPassword(email: string, data: any, res: Response) {
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
    } catch (error) {
      console.log('Error sending email: ', error.response.body);
      res.json({ data: 'An Error ocurred' });
    }
  }
}

export default Mailer;
