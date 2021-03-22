import { Router } from 'express';

const router = Router();

router.get('/', () => {
  console.log('this is the root route');
});

export default router;
