import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import deviceRoutes from './routes/devices';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

export default app;
