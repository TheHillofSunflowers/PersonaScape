import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Frontend dev server
  credentials: true,
}));

app.options('*', cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Profile Builder API is running 🚀');
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
});

app.use('/api/auth', authRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
