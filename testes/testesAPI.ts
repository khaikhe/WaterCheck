import request from 'supertest';
import app from '../src/app/app';

describe('Testando a API de leitura de imagens', () => {
  it('Deve retornar sucesso na leitura da imagem', async () => {
    const response = await request(app)
      .post('/measures/upload')
      .send({
        image: 'caminho/para/sua/imagem.jpg', // Substitua pelo caminho correto da imagem
        customer_code: 'customer123',
        measure_datetime: '2024-08-30T12:00:00Z',
        measure_type: 'WATER'
      });

    expect(response.status).toBe(200); // Verifica se o status é 200
    expect(response.body).toHaveProperty('image_url'); // Verifica se a resposta tem o campo image_url
  },15000);
});
