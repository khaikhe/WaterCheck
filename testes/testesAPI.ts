import request from 'supertest';
import app from '../src/app/app'; // Importe sua aplicação Express em TypeScript

describe('Testando a API de leitura de imagens', () => {
  it('Deve retornar sucesso na leitura da imagem', async () => {
    const response = await request(app)
      .post('/seu-endpoint')  // Substitua pelo endpoint correto
      .send({ imagem: 'caminho/para/sua/imagem.jpg' });  // Substitua pelo corpo correto da requisição
    
    expect(response.status).toBe(200);  // Verifica se o status é 200
    expect(response.body).toHaveProperty('resultado');  // Verifica se a resposta tem o campo esperado
  });
});
