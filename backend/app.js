import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import templateRoutes from './routes/templateRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import eventRoutes from './routes/eventRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
} else {
  app.use(cors({
      origin: true,
      credentials: true
    }));
  console.warn("MNKi | DEV MODE, CORS SET TO TRUE, DO NOT FORGET TO CHANGE ON DEPLOY")
}

app.use(express.json());
app.use(cookieParser());


// Serve static files from the "public" folder
app.use('/api/static', express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/api', noteRoutes);
app.use('/api', templateRoutes);
app.use('/api', memberRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api', eventRoutes);
app.use('/', eventRoutes);

export default app;
