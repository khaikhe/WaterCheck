import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database';
import measureRoutes from './rotas/rotasmedidas';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, 'uploads');

// Verifica se a pasta de uploads existe; se não, cria
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use('/controles', measureRoutes);

const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { app, server };
