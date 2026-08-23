import express from 'express';
import handler from './api/orders';

const app = express();
app.use(express.json());

app.all('/api/orders', async (req, res) => {
  await handler(req as any, res as any);
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
});
