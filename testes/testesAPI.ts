import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import request from 'supertest';
import fs from 'fs';
import app from '../src/app/app';

dotenv.config();

let server: any;

beforeAll(async () => {
 
  if (mongoose.connection.readyState === 0) { // Conexão fechada
    await mongoose.connect(process.env.DB_URI_TEST || 'mongodb://localhost:27017/');
  }

  
  server = app.listen(process.env.PORT || 3000, () => {
    console.log('Test server running');
  });
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) { // Conexão aberta
    await mongoose.connection.close();
  }
});

describe('Testando a API de leitura de imagens', () => {
  it('Deve retornar sucesso na leitura da imagem', async () => {
    const imagePath = path.resolve(__dirname, '../public/teste12.jpeg'); 
  
   
    if (!fs.existsSync(imagePath)) {
      throw new Error('O arquivo da imagem de teste não foi encontrado.');
    }
  
    const response = await request(app)
      .post('/measures/upload')
      .attach('image', imagePath) 
      .field('customer_code', 'customer123')
      .field('measure_datetime', '2024-08-30T12:00:00Z')
      .field('measure_type', 'WATER');
  
    console.log('Response:', response.body); 
    console.error('Error:', response.error); 
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('image_url');
    expect(response.body).toHaveProperty('measure_value');
    expect(response.body).toHaveProperty('measure_uuid');
  }, 150000); // Timeout aumentado para 150 segundos
});
