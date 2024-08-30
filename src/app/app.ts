
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database';
import measureRoutes from './rotas/rotasmedidas';

dotenv.config();

const app = express();
app.use(express.json());


connectDB();


app.use('/measures', measureRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
