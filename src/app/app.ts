
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database';
import measureRoutes from './rotas/rotasmedidas';
import fs from 'fs';
import path from 'path';

// Define o caminho para a pasta de uploads
const uploadDir = path.join(__dirname, 'uploads');

// Verifica se a pasta de uploads existe; se não, cria
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

dotenv.config();

const app = express();
app.use(express.json());


connectDB();


app.use('/measures', measureRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
