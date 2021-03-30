import { Router } from 'express';
import { authorize } from '../../middlewares/authorize';
import UserController from './user.controller';

const router = Router();

router.get('/me', authorize, UserController.me);

export default router;
