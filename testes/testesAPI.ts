import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import request from 'supertest';
import fs from 'fs';
import { app, server } from '../src/app/app'; // Importar a instância do servidor

dotenv.config();

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) { // Conexão fechada
    await mongoose.connect(process.env.DB_URI_TEST || 'mongodb://localhost:27017/');
  }

  // Não é necessário criar um servidor aqui, pois já está sendo exportado
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) { 
    await mongoose.connection.close();
  }
  if (server) {
    server.close(); // Fecha o servidor após o teste
  }
});

describe('Testando a API de leitura de imagens', () => {
  it('Deve retornar sucesso na leitura da imagem', async () => {
    const imagePath = path.resolve(__dirname, '../uploads/testes1234.jpg'); 

    if (!fs.existsSync(imagePath)) {
      throw new Error('O arquivo da imagem de teste não foi encontrado.');
    }

    const uniqueDate = new Date().toISOString(); // Gera uma data única para evitar conflitos
    const response = await request(app)
      .post('/controles/upload')
      .attach('image', imagePath)
      .field('customer_code', 'customer123')
      .field('measure_datetime', uniqueDate)
      .field('measure_type', 'WATER');

    console.log(response.body); // Debugging

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('image_url');
    expect(response.body).toHaveProperty('measure_value');
    expect(response.body).toHaveProperty('measure_uuid');
  }, 150000); // Timeout aumentado para 150 segundos
});
