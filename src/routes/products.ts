import { Router } from 'express';
import { products } from '../products';

const router = Router();

router.get('/api/products', (req, res) => {
  res.json(products);
});

export default router;