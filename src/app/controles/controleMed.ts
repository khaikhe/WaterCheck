import { Request, Response } from 'express';
import Measure, { IMeasure } from '../models/medicao';
import { uploadFileToGemini } from '../servicos/gemini';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { getMeasureFromImage } from '../servicos/gemini';

export const uploadMeasure = async (req: Request, res: Response) => {
  const { customer_code, measure_datetime, measure_type } = req.body;
  const file = req.file;

  if (!file || !customer_code || !measure_datetime || !measure_type) {
    if (file) {
      fs.unlinkSync(file.path);
    }
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Parâmetros inválidos ou arquivo ausente."
    });
  }

  try {
    const existingMeasure = await Measure.findOne({
      customer_code,
      measure_type,
      measure_datetime: { 
        $gte: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth(), 1),
        $lt: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth() + 1, 1)
      }
    });

    if (existingMeasure) {
      fs.unlinkSync(file.path);
      return res.status(409).json({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada."
      });
    }

    const fileUri = await uploadFileToGemini(file.path, file.mimetype, file.originalname);
    fs.unlinkSync(file.path);

    const prompt = "Descreva o conteúdo desta imagem de cálculos matemáticos.";
    const description = await getMeasureFromImage(fileUri, file.mimetype, prompt);

    const calculations = extractCalculationsFromDescription(description);

    if (!calculations || calculations.length === 0) {
      return res.status(400).json({
        error_code: "NO_MEASURE_FOUND",
        error_description: "Nenhum cálculo matemático encontrado na imagem."
      });
    }

    // Use um único valor, por exemplo, a soma de todos os valores
    const measureValue = calculations.reduce((acc, curr) => acc + curr, 0);

    const measure_uuid = uuidv4();

    const newMeasure: IMeasure = new Measure({
      customer_code,
      measure_datetime,
      measure_type,
      measure_value: measureValue, // Armazena como um único número
      image_url: fileUri,
      measure_uuid
    });

    await newMeasure.save();

    res.status(200).json({
      image_url: newMeasure.image_url,
      measure_value: newMeasure.measure_value,
      measure_uuid: newMeasure.measure_uuid
    });
  } catch (error) {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro desconhecido.' });
    }
  }
};

const extractCalculationsFromDescription = (description: string): number[] => {
  // Adapte o regex para capturar números e cálculos
  const calculationRegex = /\d+(?:[\+\-\*\/]\d+)*/g;
  const matches = description.match(calculationRegex);

  // Converte os cálculos para valores numéricos, se possível
  return matches ? matches.map(calc => eval(calc)) : [];
};

export const confirmMeasure = async (req: Request, res: Response) => {
  const { measure_uuid } = req.body;

  if (!measure_uuid) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "UUID da medição ausente."
    });
  }

  try {
    const measure = await Measure.findOne({ measure_uuid });

    if (!measure) {
      return res.status(404).json({
        error_code: "NOT_FOUND",
        error_description: "Medição não encontrada."
      });
    }

    measure.confirmed = true;
    await measure.save();

    res.status(200).json({
      message: "Medição confirmada com sucesso.",
      measure
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro desconhecido.'
    });
  }
};

export const listMeasures = async (req: Request, res: Response) => {
  const { customer_code, start_date, end_date } = req.query;

  try {
    const filter: any = {};
    if (customer_code) {
      filter.customer_code = customer_code;
    }
    if (start_date && end_date) {
      filter.measure_datetime = { 
        $gte: new Date(start_date as string),
        $lt: new Date(end_date as string)
      };
    }

    const measures = await Measure.find(filter);

    res.status(200).json(measures);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro desconhecido.'
    });
  }
};
