import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Frontend dev server
    credentials: true,
  }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Profile Builder API is running 🚀');
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));