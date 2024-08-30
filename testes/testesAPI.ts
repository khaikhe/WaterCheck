import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import request from 'supertest';
import fs from 'fs';
import app from '../src/app/app'; // Ajuste o caminho conforme necessário

dotenv.config();

let server: any;

beforeAll(async () => {
  // Conecta ao banco de dados de teste apenas se não estiver já conectado
  if (mongoose.connection.readyState === 0) { // Conexão fechada
    await mongoose.connect(process.env.DB_URI_TEST || 'mongodb://localhost:27017/');
  }

  // Inicia o servidor antes de executar os testes
  server = app.listen(process.env.PORT || 3000, () => {
    console.log('Test server running');
  });
});

afterAll(async () => {
  // Fecha a conexão com o banco de dados após os testes
  if (mongoose.connection.readyState !== 0) { // Conexão aberta
    await mongoose.connection.close();
  }
});

describe('Testando a API de leitura de imagens', () => {
  it('Deve retornar sucesso na leitura da imagem', async () => {
    const imagePath = path.resolve(__dirname, '../public/teste12.jpeg'); // Caminho do arquivo de teste
  
    // Verifica se o arquivo existe
    if (!fs.existsSync(imagePath)) {
      throw new Error('O arquivo da imagem de teste não foi encontrado.');
    }
  
    const response = await request(app)
      .post('/measures/upload')
      .attach('image', imagePath) // Envia o arquivo como parte da requisição
      .field('customer_code', 'customer123')
      .field('measure_datetime', '2024-08-30T12:00:00Z')
      .field('measure_type', 'WATER');
  
    console.log('Response:', response.body); // Adiciona log para ver a resposta completa
    console.error('Error:', response.error); // Adiciona log para verificar possíveis erros
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('image_url');
    expect(response.body).toHaveProperty('measure_value');
    expect(response.body).toHaveProperty('measure_uuid');
  }, 150000); // Timeout aumentado para 150 segundos
});
