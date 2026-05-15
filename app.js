import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'express-async-errors';
import express from 'express';

import authRouter from './routes/auth.js';
import jobRouter from './routes/jobs.js';

import { notFoundMiddleware } from './middleware/not-found.js';
import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { connectDB } from './db/connect.js';
import { protectedRoute } from './middleware/authentication.js';

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', protectedRoute, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
