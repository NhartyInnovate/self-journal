import 'dotenv/config';
import express from 'express';
import ordersHandler from './api/orders';
import adminHandler from './api/admin/product';
import productHandler from './api/product';
import webhookHandler from './api/webhooks/paystack';
import orderStatusHandler from './api/order-status';
import adminReadyHandler from './api/admin/orders/ready';
import cronReleaseHandler from './api/cron/release';

const app = express();

// Webhook needs raw body stream, bypass express.json()
app.use('/api/webhooks/paystack', (req, res, next) => {
  next();
}, webhookHandler as any);

app.use(express.json());

app.all('/api/orders', async (req, res) => await ordersHandler(req as any, res as any));
app.all('/api/admin/product', async (req, res) => await adminHandler(req as any, res as any));
app.all('/api/product', async (req, res) => await productHandler(req as any, res as any));
app.all('/api/order-status', async (req, res) => await orderStatusHandler(req as any, res as any));
app.all('/api/admin/orders/ready', async (req, res) => await adminReadyHandler(req as any, res as any));
app.all('/api/cron/release', async (req, res) => await cronReleaseHandler(req as any, res as any));

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Local API Server running on http://localhost:${PORT}`);
  console.log(`Proxy your frontend to this port to test Vercel API routes locally.`);
});
