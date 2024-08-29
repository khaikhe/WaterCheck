import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_URL = 'https://api.google.dev/gemini/v1/vision';

export const getMeasureFromImage = async (imageBase64: string) => {
  try {
    // 1. Validate Image Data (Optional):
    //   - Check if imageBase64 is a valid base64 string (outside this code snippet)
    //   - Add checks for image size, format, etc. (if applicable)

    // 2. Send Request to Gemini API:
    const response = await axios.post(GEMINI_API_URL, {
      image: imageBase64,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // 3. Handle Successful Response (Status Code 200):
    if (response.status !== 200) {
      throw new Error(`Erro ao obter a medida: ${response.statusText}`);
    }

    // 4. Extract Measurement Data (Adapt to API Response Structure):
    const measurementData = response.data.measurement; // Adjust based on your API

    return measurementData;

  } catch (error) {
    // 5. Handle Errors:
    if (error instanceof axios.AxiosError) {
      console.error('Erro de rede:', error.message);
      // Optionally log more details (error code, request/response data)
    } else {
      console.error('Erro desconhecido:', error);
    }

    throw new Error('Falha ao obter a medida da imagem');
  }
};