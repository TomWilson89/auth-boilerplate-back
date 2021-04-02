import { Router } from 'express';
import AuthController from './auth.controller';
import AuthValidation from './auth.validation';

const router = Router();

router.route('/register').post(AuthValidation.create, AuthController.create);

router.route('/login').post(AuthValidation.login, AuthController.login);

router.route('/google-login').post(AuthController.googleLogin);

router.route('/facebook-login').post(AuthController.facebookLogin);

router.route('/activation').post(AuthController.accountActivation);

router.route('/forgot-password').post(AuthValidation.forgotPassword, AuthController.forgotPassword);

router.route('/reset-password').post(AuthValidation.resetPassword, AuthController.resetPassword);

export default router;
