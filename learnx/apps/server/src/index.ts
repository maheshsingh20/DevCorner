import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import api from './routes';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_ORIGIN?.split(',') || '*', credentials: true }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*', credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'learnx-api', time: new Date().toISOString() });
});

// Routes
app.use('/api', api);

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});

const PORT = Number(process.env.PORT || 4000);
const MONGO_URI = process.env.MONGO_URI || '';

async function start() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
    } else {
      // eslint-disable-next-line no-console
      console.warn('MONGO_URI not set. Starting server without database connection.');
    }
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();