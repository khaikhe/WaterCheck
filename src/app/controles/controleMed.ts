import { Request, Response } from 'express';
import Measure, { IMeasure } from '../models/medicao';
import { getMeasureFromImage } from '../servicos/gemini';
import { v4 as uuidv4 } from 'uuid';

export const uploadMeasure = async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  if (!image || !customer_code || !measure_datetime || !measure_type) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Parâmetros inválidos."
    });
  }

  const existingMeasure = await Measure.findOne({
    customer_code,
    measure_type,
    measure_datetime: { $gte: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth(), 1) }
  });

  if (existingMeasure) {
    return res.status(409).json({
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada."
    });
  }

  try {
    const geminiResponse = await getMeasureFromImage(image);
    const measure_uuid = uuidv4();

    const newMeasure: IMeasure = new Measure({
      customer_code,
      measure_datetime,
      measure_type,
      measure_value: geminiResponse.value,
      image_url: geminiResponse.image_url,
      measure_uuid
    });

    await newMeasure.save();

    res.status(200).json({
      image_url: newMeasure.image_url,
      measure_value: newMeasure.measure_value,
      measure_uuid: newMeasure.measure_uuid
    });
} catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: 'Erro desconhecido.' });
    }
}

};

export const confirmMeasure = async (req: Request, res: Response) => {
  const { measure_uuid, confirmed_value } = req.body;

  const measure = await Measure.findOne({ measure_uuid });

  if (!measure) {
    return res.status(404).json({
      error_code: "MEASURE_NOT_FOUND",
      error_description: "Leitura não encontrada."
    });
  }

  if (measure.has_confirmed) {
    return res.status(409).json({
      error_code: "CONFIRMATION_DUPLICATE",
      error_description: "Leitura já confirmada."
    });
  }

  measure.measure_value = confirmed_value;
  measure.has_confirmed = true;
  await measure.save();

  res.status(200).json({ success: true });
};

export const listMeasures = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  const filter: any = { customer_code };

  if (measure_type) {
    if (typeof measure_type === 'string') {
        if (['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
            filter.measure_type = measure_type.toUpperCase();
        } else {
            return res.status(400).json({
                error_code: "INVALID_TYPE",
                error_description: "Tipo de medição não permitida."
            });
        }
    } else {
        return res.status(400).json({
            error_code: "INVALID_TYPE",
            error_description: "Tipo de medição não permitida."
        });
    }
}


  const measures = await Measure.find(filter);

  if (measures.length === 0) {
    return res.status(404).json({
      error_code: "MEASURES_NOT_FOUND",
      error_description: "Nenhuma leitura encontrada."
    });
  }

  res.status(200).json({
    customer_code,
    measures: measures.map(measure => ({
      measure_uuid: measure.measure_uuid,
      measure_datetime: measure.measure_datetime,
      measure_type: measure.measure_type,
      has_confirmed: measure.has_confirmed,
      image_url: measure.image_url
    }))
  });
};
