import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'express-async-errors';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import authRouter from './routes/auth.js';
import jobRouter from './routes/jobs.js';

import { connectDB } from './db/connect.js';

import { protectedRoute } from './middleware/authentication.js';
import { notFoundMiddleware } from './middleware/not-found.js';
import { errorHandlerMiddleware } from './middleware/error-handler.js';

const app = express();

// RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// SECURITY + MIDDLEWARE
app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(mongoSanitize());

app.use(limiter);

app.use(morgan('tiny'));

// ROUTES
app.use('/api/v1/auth', authRouter);

app.use('/api/v1/jobs', protectedRoute, jobRouter);

// NOT FOUND
app.use(notFoundMiddleware);

// ERROR HANDLER
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
