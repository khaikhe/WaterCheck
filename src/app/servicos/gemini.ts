
import dotenv from 'dotenv';
import { GoogleAIFileManager } from '@google/generative-ai/server';

dotenv.config();

const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://api.gemini.com/v1/readimage';

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || '');

export const uploadFileToGemini = async (imagePath: string, mimeType: string, displayName: string) => {
  try {
    const uploadResponse = await fileManager.uploadFile(imagePath, {
      mimeType,
      displayName,
    });
    console.log(`Imagem carregada como: ${uploadResponse.file.uri}`);
    return uploadResponse.file.uri;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem para o Gemini:', error);
    throw new Error('Falha ao fazer upload da imagem.');
  }
};

export const getMeasureFromImage = async (fileUri: string, prompt: string) => {
  try {
    
    const { GoogleGenerativeAI } = require ("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: "image/jpeg",
          fileUri: fileUri
        }
      },
      { text: prompt },
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Erro ao obter a medida da imagem:', error);
    throw new Error('Falha ao obter a medida da imagem.');
  }
};
