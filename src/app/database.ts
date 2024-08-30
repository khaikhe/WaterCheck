import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/';

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI); // Não é mais necessário passar opções como useNewUrlParser
    console.log('Connected to MongoDB');
  } catch (error) {
    if( error instanceof Error)
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
