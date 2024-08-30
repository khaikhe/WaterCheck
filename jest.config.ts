import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/testes/**/*.ts'],
  setupFiles: ['dotenv/config'], // Adicione esta linha
};

export default config;
