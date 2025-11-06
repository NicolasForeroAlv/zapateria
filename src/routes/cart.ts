import { Router } from 'express';
import fs from 'fs/promises';
import { requireAuth } from '../middleware/auth';
import path from 'path';
import { products } from '../products';

const router = Router();
const DATA_PATH = path.join(__dirname, '..', 'data', 'data.json');

async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { cart: [], products: [] };
  }
}
async function writeData(data: any) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

router.get('/api/cart', requireAuth, async (req, res) => {
  const data = await readData();
  res.json(data.cart || []);
});

router.post('/api/cart/add', requireAuth, async (req, res) => {
  const { id, quantity } = req.body;
  const qty = Number(quantity);
  if (!id || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ error: 'ID faltante o cantidad inválida (debe ser entero > 0)' });
  }
  const prod = products.find(p => p.id === id);
  if (!prod) return res.status(400).json({ error: 'Producto no existe' });

  const data = await readData();
  data.cart = data.cart || [];
  const existing = data.cart.find((c:any)=>c.id===id);
  if (existing) {
    existing.quantity += qty;
  } else {
    data.cart.push({ id, name: prod.name, price: prod.price, quantity: qty });
  }
  await writeData(data);
  res.json({ success: true, cart: data.cart });
});

// remove route
router.post('/api/cart/remove', requireAuth, async (req, res) => {
  const { id, quantity } = req.body;
  const qty = Number(quantity || 0);
  if (!id || qty < 0) {
    return res.status(400).json({ error: 'ID faltante o cantidad inválida (no puede ser negativa)' });
  }
  const data = await readData();
  data.cart = data.cart || [];
  data.cart = data.cart.map((c:any)=>({ ...c })).filter((c:any)=>{
    if (c.id !== id) return true;
    c.quantity -= qty;
    return c.quantity > 0;
  });
  await writeData(data);
  res.json({ success: true, cart: data.cart });
});

// total route
router.get('/api/cart/total', requireAuth, async (req, res) => {
  const data = await readData();
  const cart = data.cart || [];
  const total = cart.reduce((sum:any, item:any) => sum + (item.price * item.quantity), 0);
  res.json({ total });
});

export default router;