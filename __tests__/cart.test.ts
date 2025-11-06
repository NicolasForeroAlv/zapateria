import request from 'supertest';
import app from '../src/app';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'data.json');

beforeEach(()=>{
  // reset data.json
  fs.writeFileSync(DATA_PATH, JSON.stringify({ cart: [], products: []}, null, 2), 'utf-8');
});

describe('Auth and Cart API', ()=>{
  let token = '';

  test('Login returns token with valid credentials', async ()=>{
    const res = await request(app).post('/api/auth/login').send({ username: 'test', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    token = res.body.token;
  });

  test('Accessing cart without token is forbidden', async ()=>{
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
  });

  test('Add product fails if product id does not exist', async ()=>{
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 'no-ex', quantity: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  test('Add product fails with invalid quantity', async ()=>{
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 'p1001', quantity: -3 });
    expect(res.status).toBe(400);
  });

  test('Add product succeeds with valid data', async ()=>{
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 'p1001', quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body.cart).toBeDefined();
    expect(res.body.cart.find((c:any)=>c.id==='p1001').quantity).toBe(2);
  });

  test('Get cart returns items with token', async ()=>{
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Total calculates correctly', async ()=>{
    // add another product first
    await request(app).post('/api/cart/add').set('Authorization', `Bearer ${token}`).send({ id: 'p1002', quantity: 1 });
    const res = await request(app).get('/api/cart/total').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
  });

  test('Remove product with invalid quantity returns 400', async ()=>{
    const res = await request(app).post('/api/cart/remove').set('Authorization', `Bearer ${token}`).send({ id: 'p1001', quantity: -5 });
    expect(res.status).toBe(400);
  });

  test('Remove product reduces quantity or removes item', async ()=>{
    // ensure item exists
    await request(app).post('/api/cart/add').set('Authorization', `Bearer ${token}`).send({ id: 'p1001', quantity: 3 });
    const res = await request(app).post('/api/cart/remove').set('Authorization', `Bearer ${token}`).send({ id: 'p1001', quantity: 2 });
    expect(res.status).toBe(200);
    const cart = res.body.cart;
    const item = cart.find((c:any)=>c.id==='p1001');
    expect(item.quantity).toBeGreaterThanOrEqual(0);
  });
});