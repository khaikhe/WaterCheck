import { Router } from 'express';
import { uploadMeasure, confirmMeasure, listMeasures } from '../controles/controleMed';
import upload from '../controles/upload';

const router = Router();

// Endpoint para upload de uma nova medição
router.post('/upload', upload.single('image'), uploadMeasure);

// Endpoint para confirmação de uma medição
router.patch('/confirm', confirmMeasure);

// Endpoint para listar medições de um cliente específico
router.get('/:customer_code/list', listMeasures);

export default router;
