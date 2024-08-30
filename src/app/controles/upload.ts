import multer from 'multer';
import { Request } from 'express';


const storage = multer.diskStorage({
  destination: function (req: Request, _file, cb) { 
    cb(null, 'uploads/'); 
  },
  filename: function (req: Request, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido') as any, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // Limite de 20MB
});

export default upload;
