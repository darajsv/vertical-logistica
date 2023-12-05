import { Router } from 'express';
import { uploadFile } from '../config/multer';
import importDataController from '../modules/importData/importData.controller';

const router = Router();

router.post('/import-data', uploadFile.single('file'), importDataController);

export default router;
