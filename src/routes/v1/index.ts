import { Router } from 'express';
import AuthRoutes from '../../services/auth/auth.routes';
import UserRoutes from '../../services/user/user.routes';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/user', UserRoutes);

export default router;
