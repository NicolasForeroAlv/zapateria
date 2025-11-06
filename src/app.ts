import express from 'express';
import bodyParser from 'body-parser';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';
import authRouter from './routes/auth';
import path from 'path';

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(productsRouter);
app.use(cartRouter);
app.use(authRouter);

export default app;