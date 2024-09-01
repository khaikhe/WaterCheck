import dotenv from 'dotenv';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generatePrompt } from '../../utils/promptHelper';

dotenv.config();

const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/files';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('A variável de ambiente GEMINI_API_KEY não está definida.');
}

const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);

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

export const getMeasureFromImage = async (fileUri: string, mimeType: string, documentType: string) => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = generatePrompt(documentType);

    const result = await model.generateContent([
      {
        fileData: {
          fileUri,
          mimeType,
          
        },
      },
      {
        text: prompt,
      },
    ]);

    console.log(result.response.text()); 
   
    return result.response.text(); 
  } catch (error) {
    console.error('Erro ao obter a medida da imagem:', error);
    throw new Error('Falha ao obter a medida da imagem.');
  }
};
