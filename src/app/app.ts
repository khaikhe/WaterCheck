import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import measureRoutes from './rotas/rotasmedidas';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/measures', measureRoutes);

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/projeto';

mongoose.connect(DB_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(`Failed to connect to MongoDB: ${err.message}`));
