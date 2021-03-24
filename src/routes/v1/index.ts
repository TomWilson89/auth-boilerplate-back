import { Router } from 'express';
import AuthRoutes from '../../services/auth/auth.routes';

const router = Router();

router.use('/', AuthRoutes);

export default router;
