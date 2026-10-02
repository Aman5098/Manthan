import express from 'express';
import cors from 'cors';
import path from 'node:path';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.WEB_ORIGIN?.split(',') || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
