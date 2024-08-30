import { Router } from 'express';
import { uploadMeasure, confirmMeasure, listMeasures } from '../controles/controleMed';
import upload from '../controles/upload';

const router = Router();

router.post('/upload', upload.single('image'), uploadMeasure);
router.patch('/confirm', confirmMeasure);
router.get('/:customer_code/list', listMeasures);

export default router;
